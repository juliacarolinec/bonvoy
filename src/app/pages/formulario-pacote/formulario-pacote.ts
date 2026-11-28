import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { DadosPacote, Pacote } from '../../models/pacote';
import { PacoteService } from '../../services/pacote.service';
import { Router } from '@angular/router';

const formatoPreco = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function lerPreco(valor: string): number {
  const texto = valor.trim();
  const formatoBrasileiro = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/;
  const decimalComPonto = /^\d+\.\d{1,2}$/;

  if (formatoBrasileiro.test(texto)) {
    return Number(texto.replaceAll('.', '').replace(',', '.'));
  }

  return decimalComPonto.test(texto) ? Number(texto) : NaN;
}

const campoObrigatorio: ValidatorFn = ({ value }) => (value.trim() ? null : { required: true });

const precoValido: ValidatorFn = ({ value }) => {
  const preco = lerPreco(value);
  return preco > 0 && Number.isSafeInteger(Math.round(preco * 100)) ? null : { preco: true };
};

const duracaoValida: ValidatorFn = ({ value }) => {
  const texto = value.trim();
  const dias = Number(texto);
  return /^\d+$/.test(texto) && dias > 0 && Number.isSafeInteger(dias) ? null : { duracao: true };
};

const imagemValida: ValidatorFn = ({ value }) => {
  const texto = value.trim();
  const url = URL.canParse(texto) ? new URL(texto) : null;
  return url && /^https?:\/\//i.test(texto) && url.hostname ? null : { imagem: true };
};

@Component({
  selector: 'app-formulario-pacote',
  imports: [NgTemplateOutlet, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-pacote.html',
  styleUrl: './formulario-pacote.css',
})
export class FormularioPacote {
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);
  private readonly pacotes = inject(PacoteService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly editando = this.rota.snapshot.paramMap.has('id');
  protected readonly carregando = signal(this.editando);
  protected readonly erroCarregamento = signal('');
  protected readonly salvando = signal(false);
  protected readonly erroSalvar = signal('');

  protected readonly formulario = this.fb.group({
    titulo: ['', campoObrigatorio],
    destino: ['', campoObrigatorio],
    descricao: ['', campoObrigatorio],
    preco: ['', [campoObrigatorio, precoValido]],
    duracao: ['', [campoObrigatorio, duracaoValida]],
    hospedagem: ['', campoObrigatorio],
    transporte: ['', campoObrigatorio],
    imagem: ['', [campoObrigatorio, imagemValida]],
  });

  private id: string | null = null;

  constructor() {
    if (!this.editando) return;

    this.rota.paramMap
      .pipe(
        map((params) => params.get('id')!),
        tap((id) => {
          this.id = id;
          this.carregando.set(true);
          this.erroCarregamento.set('');
          this.erroSalvar.set('');
        }),
        switchMap((id) =>
          this.pacotes.buscarPorId(id).pipe(
            catchError((erro: HttpErrorResponse) => {
              this.erroCarregamento.set(
                erro.status === 404
                  ? 'Pacote não encontrado.'
                  : 'Não foi possível carregar o pacote. Recarregue a página para tentar novamente.',
              );
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((pacote) => {
        if (pacote) this.preencher(pacote);
        this.carregando.set(false);
      });
  }

  protected campoInvalido(campo: keyof DadosPacote): boolean {
    const controle = this.formulario.controls[campo];
    return controle.touched && controle.invalid;
  }

  protected salvar(): void {
    if (this.salvando() || this.carregando() || this.erroCarregamento()) return;

    this.erroSalvar.set('');
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const dados: DadosPacote = {
      titulo: valores.titulo.trim(),
      destino: valores.destino.trim(),
      descricao: valores.descricao.trim(),
      preco: lerPreco(valores.preco),
      duracao: Number(valores.duracao.trim()),
      hospedagem: valores.hospedagem.trim(),
      transporte: valores.transporte.trim(),
      imagem: valores.imagem.trim(),
    };

    const id = this.id;
    const requisicao = id === null ? this.pacotes.cadastrar(dados) : this.pacotes.editar(id, { id, ...dados });

    this.salvando.set(true);
    requisicao.pipe(finalize(() => this.salvando.set(false))).subscribe({
      next: () => {
        if (id !== this.id) return;

        void this.router.navigate(['/pacotes'], {
          info: this.editando
            ? 'Alterações salvas com sucesso.'
            : 'Pacote cadastrado com sucesso.',
        });
      },
      error: () => {
        if (id === this.id) {
          this.erroSalvar.set('Não foi possível salvar o pacote. Tente novamente.');
        }
      },
    });
  }

  private preencher({ id, preco, duracao, ...dados }: Pacote): void {
    this.formulario.reset({ ...dados, preco: formatoPreco.format(preco), duracao: String(duracao) });
  }
}

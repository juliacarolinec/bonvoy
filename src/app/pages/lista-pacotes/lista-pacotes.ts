import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pacote } from '../../models/pacote';
import { PacoteService } from '../../services/pacote.service';

@Component({
    selector: 'app-lista-pacotes',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './lista-pacotes.html',
    styleUrl: './lista-pacotes.css',
})
export class ListaPacotesComponent implements OnInit {
    readonly pacotes = signal<Pacote[]>([]);
    readonly carregando = signal(true);
    readonly erro = signal('');

    termoBusca = '';

    readonly formatoPreco = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    constructor(private pacoteService: PacoteService) { }

    get pacotesFiltrados(): Pacote[] {
        const destino = this.termoBusca.trim().toLowerCase();
        return this.pacotes().filter((pacote) =>
            pacote.destino.toLowerCase().includes(destino)
        );
    }

    ngOnInit(): void {
        this.pacoteService.listar().subscribe({
            next: (dados) => {
                this.pacotes.set(dados);
                this.carregando.set(false);
            },
            error: () => {
                this.erro.set('Não foi possível carregar os pacotes.');
                this.carregando.set(false);
            }
        });
    }

    buscar(evento: Event): void {
        const campo = evento.target as HTMLInputElement;
        this.termoBusca = campo.value;
    }

    excluir(pacote: Pacote): void {
        const confirmou = window.confirm(
            `Deseja excluir o pacote "${pacote.titulo}"?`
        );

        if (!confirmou) {
            return;
        }

        this.erro.set('');

        this.pacoteService.excluir(pacote.id).subscribe({
            next: () => {
                this.pacotes.update((itens)=>
                 itens.filter((item) => item.id !== pacote.id));
            },
            error: () => {
                this.erro.set('Não foi possível excluir o pacote.');
            }
        });
    }
}

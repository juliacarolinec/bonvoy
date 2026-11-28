import { computed, inject, Injectable, linkedSignal } from '@angular/core';
import { SessaoEquipeService } from './sessao-equipe';

@Injectable({ providedIn: 'root' })
export class PacotesSalvosService {
  private readonly sessao = inject(SessaoEquipeService);

  private readonly chave = computed(() => {
    const usuario = this.sessao.usuario();

    return usuario?.tipo === 'cliente'
      ? `bonvoy-pacotes-salvos:${usuario.id}`
      : null;
  });

  private readonly idsSalvos = linkedSignal<string[]>(() => {
    const chave = this.chave();
    return chave ? this.lerIds(chave) : [];
  });

  readonly ids = this.idsSalvos.asReadonly();
  readonly podeSalvar = computed(() => this.chave() !== null);

  alternar(id: string): void {
    const chave = this.chave();
    if (!chave) return;

    const ids = this.lerIds(chave);
    const atualizados = ids.includes(id)
      ? ids.filter((item) => item !== id)
      : [...ids, id];

    localStorage.setItem(chave, JSON.stringify(atualizados));
    this.idsSalvos.set(atualizados);
  }

  private lerIds(chave: string): string[] {
    try {
      const dados: unknown = JSON.parse(localStorage.getItem(chave) ?? '[]');

      return Array.isArray(dados)
        ? dados.filter((id): id is string => typeof id === 'string')
        : [];
    } catch {
      return [];
    }
  }
}
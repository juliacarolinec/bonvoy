import { Injectable, signal, computed } from '@angular/core';
import type { Usuario } from './usuario';

type UsuarioLogado = Pick<Usuario, 'id' | 'nome' | 'email' | 'tipo'>;

@Injectable({ providedIn: 'root' })
export class SessaoEquipeService {
  private readonly chave = 'bonvoy-usuario-logado';
  private readonly sessao = signal<UsuarioLogado | null>(this.lerSessao());

  readonly usuario = this.sessao.asReadonly();
  readonly logada = computed(() => this.usuario() !== null);
  readonly ehEquipe = computed(() => this.usuario()?.tipo === 'equipe');

  iniciar({ id, nome, email, tipo }: Usuario): void {
    const usuario = { id, nome, email, tipo };
    sessionStorage.setItem(this.chave, JSON.stringify(usuario));
    this.sessao.set(usuario);
  }

  encerrar(): void {
    sessionStorage.removeItem(this.chave);
    this.sessao.set(null);
  }

  private lerSessao(): UsuarioLogado | null {
    const dados = sessionStorage.getItem(this.chave);

    try {
      return dados ? JSON.parse(dados) : null;
    } catch {
      return null;
    }
  }
}
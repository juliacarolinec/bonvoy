import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessaoEquipeService {
  private readonly chave = 'bonvoy-equipe-logada';
  private readonly sessao = signal(sessionStorage.getItem(this.chave) === 'true');

  readonly logada = this.sessao.asReadonly();

  iniciar(): void {
    sessionStorage.setItem(this.chave, 'true');
    this.sessao.set(true);
  }

  encerrar(): void {
    sessionStorage.removeItem(this.chave);
    this.sessao.set(false);
  }
}
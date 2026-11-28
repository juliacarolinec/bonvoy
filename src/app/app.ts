import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { SessaoEquipeService } from './services/sessao-equipe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bonvoy');
  protected readonly sessaoEquipe = inject(SessaoEquipeService);
  private readonly router = inject(Router);

  protected sair(): void {
    this.sessaoEquipe.encerrar();
    void this.router.navigate(['/pacotes']);
  }
}

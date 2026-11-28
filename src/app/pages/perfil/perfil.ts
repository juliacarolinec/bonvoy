import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessaoEquipeService } from '../../services/sessao-equipe';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent {
  private readonly sessao = inject(SessaoEquipeService);
  private readonly router = inject(Router);

  protected readonly usuario = this.sessao.usuario;

  protected sair(): void {
    this.sessao.encerrar();
    void this.router.navigate(['/pacotes']);
  }
}
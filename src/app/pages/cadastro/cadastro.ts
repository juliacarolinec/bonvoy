import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: '../login/login.css',
})
export class CadastroComponent {
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);

  nome = '';
  email = '';
  senha = '';

  readonly mensagem = signal('');
  readonly salvando = signal(false);

  cadastrar(formularioValido: boolean | null): void {
    if (this.salvando()) return;

    const nome = this.nome.trim();
    const email = this.email.trim().toLowerCase();
    const senha = this.senha;

    this.mensagem.set('');

    if (!formularioValido || !nome || senha.trim().length < 6) {
      this.mensagem.set('Informe seu nome, um e-mail válido e uma senha de pelo menos 6 caracteres.');
      return;
    }

    if (email.endsWith('@bonvoy.com')) {
      this.mensagem.set('E-mails @bonvoy.com são reservados para a equipe.');
      return;
    }

    this.salvando.set(true);

    this.usuarios.listar().pipe(
      switchMap((usuarios) => {
        const emailJaCadastrado = usuarios.some(
          (usuario) => usuario.email.trim().toLowerCase() === email,
        );

        return emailJaCadastrado
          ? of(null)
          : this.usuarios.cadastrarCliente({ nome, email, senha });
      }),
      finalize(() => this.salvando.set(false)),
    ).subscribe({
      next: (usuario) => {
        if (usuario === null) {
          this.mensagem.set('Esse e-mail já tem uma conta.');
          return;
        }

        void this.router.navigate(['/login']);
      },
      error: () => {
        this.mensagem.set('Não foi possível criar a conta. Tente novamente.');
      },
    });
  }
}
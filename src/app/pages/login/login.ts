
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  senha = '';
  mensagem = '';
  carregando = false;

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  entrar() {
    this.mensagem = '';

    if (!this.email.trim() || !this.senha) {
      this.mensagem = 'Preencha o e-mail e a senha.';
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(this.email.trim())) {
      this.mensagem = 'Digite um e-mail válido.';
      return;
    }

    this.carregando = true;

    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(
          u => u.email === this.email.trim() &&
               u.senha === this.senha
        );

        this.carregando = false;

        if (usuario) {
          this.router.navigate(['/pacotes']);
        } else {
          this.mensagem = 'E-mail ou senha incorretos.';
        }
      },
      error: () => {
        this.carregando = false;
        this.mensagem = 'Erro ao conectar com o servidor.';
      }
    });
  }
}

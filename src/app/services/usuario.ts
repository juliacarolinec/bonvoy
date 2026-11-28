
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: 'cliente' | 'equipe';
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/usuarios';

  listar() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}

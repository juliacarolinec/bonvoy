import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pacote } from '../models/pacote';

@Injectable({
    providedIn: 'root'
})
export class PacoteService {
    private apiUrl = 'http://localhost:3000/pacotes';

    constructor(private http: HttpClient) { }

    listar(): Observable<Pacote[]> {
        return this.http.get<Pacote[]>(this.apiUrl);
    }

    buscarPorId(id: string): Observable<Pacote> {
        return this.http.get<Pacote>(`${this.apiUrl}/${id}`);
    }

    cadastrar(pacote: Pacote): Observable<Pacote> {
        return this.http.post<Pacote>(this.apiUrl, pacote);
    }

    editar(id: string, pacote: Pacote): Observable<Pacote> {
        return this.http.put<Pacote>(`${this.apiUrl}/${id}`, pacote);
    }

    excluir(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
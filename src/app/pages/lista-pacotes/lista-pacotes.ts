import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pacote } from '../../models/pacote';
import { PacoteService } from '../../services/pacote.service';

@Component({
    selector: 'app-lista-pacotes',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <h1>Pacotes de viagens</h1>
    <p><a routerLink="/pacotes/novo">Cadastrar pacote</a></p>

    <label for="busca">Buscar por destino:</label>
    <input
      id="busca"
      type="text"
      placeholder="Digite um destino"
      (input)="buscar($event)"
    >

    <p *ngIf="erro">{{ erro }}</p>
    <p *ngIf="carregando">Carregando pacotes...</p>

    <article *ngFor="let pacote of pacotesFiltrados">
      <img
        [src]="pacote.imagem"
        [alt]="'Destino: ' + pacote.destino"
        width="300"
      >

      <h2>{{ pacote.titulo }}</h2>
      <p>{{ pacote.duracao }} dias</p>
      <p>{{ pacote.preco | currency:'BRL' }}</p>

      <a [routerLink]="['/pacotes', pacote.id]">Ver detalhes</a>
      <a [routerLink]="['/pacotes', pacote.id, 'editar']">Editar</a>

      <button type="button" (click)="excluir(pacote)">
        Excluir
      </button>
    </article>

    <p *ngIf="!carregando && pacotesFiltrados.length === 0 && !erro">
      Nenhum pacote encontrado.
    </p>
  `
})
export class ListaPacotesComponent implements OnInit {
    pacotes: Pacote[] = [];
    termoBusca = '';
    carregando = true;
    erro = '';

    constructor(private pacoteService: PacoteService) { }

    get pacotesFiltrados(): Pacote[] {
        return this.pacotes.filter(pacote =>
            pacote.destino.toLowerCase().includes(this.termoBusca.toLowerCase())
        );
    }

    ngOnInit(): void {
        this.pacoteService.listar().subscribe({
            next: dados => {
                this.pacotes = dados;
                this.carregando = false;
            },
            error: () => {
                this.erro = 'Não foi possível carregar os pacotes.';
                this.carregando = false;
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

        this.pacoteService.excluir(pacote.id).subscribe({
            next: () => {
                this.pacotes = this.pacotes.filter(item => item.id !== pacote.id);
            },
            error: () => {
                this.erro = 'Não foi possível excluir o pacote.';
            }
        });
    }
}

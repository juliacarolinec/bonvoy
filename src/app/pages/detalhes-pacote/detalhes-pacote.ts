import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Pacote } from '../../models/pacote';
import { PacoteService } from '../../services/pacote.service';

@Component({
    selector: 'app-detalhes-pacote',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h1>Detalhes do pacote</h1>

    <p *ngIf="carregando">Carregando pacote...</p>

    <p *ngIf="erro">{{ erro }}</p>

    <div *ngIf="pacote">
      <img [src]="pacote.imagem" [alt]="pacote.destino" width="400">

      <h2>{{ pacote.titulo }}</h2>
      <p>Destino: {{ pacote.destino }}</p>
      <p>Preço: {{ pacote.preco | currency:'BRL' }}</p>
      <p>Duração: {{ pacote.duracao }} dias</p>
      <p>Hospedagem: {{ pacote.hospedagem }}</p>
      <p>Transporte: {{ pacote.transporte }}</p>

      <h3>Descrição</h3>
      <p>{{ pacote.descricao }}</p>
    </div>
  `
})
export class DetalhesPacoteComponent implements OnInit {
    pacote?: Pacote;
    carregando = true;
    erro = '';

    constructor(
        private route: ActivatedRoute,
        private pacoteService: PacoteService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.erro = 'ID do pacote não encontrado.';
            this.carregando = false;
            return;
        }

        this.pacoteService.buscarPorId(id).subscribe({
            next: dados => {
                this.pacote = dados;
                this.carregando = false;
            },
            error: () => {
                this.erro = 'Não foi possível encontrar esse pacote.';
                this.carregando = false;
            }
        });
    }
}
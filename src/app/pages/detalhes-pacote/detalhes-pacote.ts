import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pacote } from '../../models/pacote';
import { PacoteService } from '../../services/pacote.service';

@Component({
    selector: 'app-detalhes-pacote',
    standalone: true,
    templateUrl: './detalhes-pacote.html',
    styleUrl: './detalhes-pacote.css'
})
export class DetalhesPacoteComponent implements OnInit {
    readonly pacote = signal<Pacote | null>(null);
    readonly carregando = signal(true);
    readonly erro = signal('');

    readonly formatoPreco = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    constructor(
        private route: ActivatedRoute,
        private pacoteService: PacoteService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            this.erro.set('ID do pacote não encontrado.');
            this.carregando.set(false);
            return;
        }

        this.pacoteService.buscarPorId(id).subscribe({
            next: (dados) => {
                this.pacote.set(dados);
                this.carregando.set(false);
            },
            error: () => {
                this.erro.set('Não foi possível encontrar esse pacote.');
                this.carregando.set(false);
            }
        });
    }
}
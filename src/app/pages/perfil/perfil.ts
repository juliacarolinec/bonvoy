import { Component, inject, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessaoEquipeService } from '../../services/sessao-equipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Pacote } from '../../models/pacote';
import { PacoteService } from '../../services/pacote.service';
import { PacotesSalvosService } from '../../services/pacotes-salvos';

@Component({
    imports: [RouterLink],
    selector: 'app-perfil',
    standalone: true,
    templateUrl: './perfil.html',
    styleUrl: './perfil.css',
})
export class PerfilComponent {
    private readonly sessao = inject(SessaoEquipeService);
    private readonly router = inject(Router);
    private readonly pacotes = inject(PacoteService);
    protected readonly salvos = inject(PacotesSalvosService);

    protected readonly usuario = this.sessao.usuario;
    private readonly catalogo = signal<Pacote[]>([]);
    protected readonly carregandoSalvos = signal(false);
    protected readonly erroSalvos = signal('');

    protected readonly pacotesSalvos = computed(() => {
        const ids = new Set(this.salvos.ids());
        return this.catalogo().filter((pacote) => ids.has(pacote.id));
    });

    protected readonly formatoPreco = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    constructor() {
        if (this.salvos.ids().length === 0) return;

        this.carregandoSalvos.set(true);

        this.pacotes.listar().pipe(takeUntilDestroyed()).subscribe({
            next: (pacotes) => {
                this.catalogo.set(pacotes);
                this.carregandoSalvos.set(false);
            },
            error: () => {
                this.erroSalvos.set('Não foi possível carregar os pacotes salvos.');
                this.carregandoSalvos.set(false);
            },
        });
    }

    protected sair(): void {
        this.sessao.encerrar();
        void this.router.navigate(['/pacotes']);
    }
}
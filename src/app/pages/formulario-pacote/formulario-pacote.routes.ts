import { Routes } from '@angular/router';
import { equipeGuard } from '../../guards/equipe.guard';

const carregarFormulario = () =>
  import('./formulario-pacote').then((modulo) => modulo.FormularioPacote);

export const formularioPacoteRoutes: Routes = [
  {
    path: 'pacotes/novo',
    title: 'Novo pacote',
    canActivate: [equipeGuard],
    loadComponent: carregarFormulario,
  },
  {
    path: 'pacotes/:id/editar',
    title: 'Editar pacote',
    canActivate: [equipeGuard],
    loadComponent: carregarFormulario,
  },
];
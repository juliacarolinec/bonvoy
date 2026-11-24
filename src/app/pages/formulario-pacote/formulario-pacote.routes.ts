import { Routes } from '@angular/router';

const carregarFormulario = () =>
  import('./formulario-pacote').then((modulo) => modulo.FormularioPacote);

export const formularioPacoteRoutes: Routes = [
  { path: 'pacotes/novo', title: 'Cadastrar Novo Pacote', loadComponent: carregarFormulario },
  { path: 'pacotes/:id/editar', title: 'Editar pacote', loadComponent: carregarFormulario },
];

import { Routes } from '@angular/router';
import { ListaPacotesComponent } from './pages/lista-pacotes/lista-pacotes';
import { DetalhesPacoteComponent } from './pages/detalhes-pacote/detalhes-pacote';

import { formularioPacoteRoutes } from './pages/formulario-pacote/formulario-pacote.routes';

export const routes: Routes = [
    { path: '', redirectTo: 'pacotes', pathMatch: 'full' },
    { path: 'pacotes', component: ListaPacotesComponent },
    ...formularioPacoteRoutes,
    { path: 'pacotes/:id', component: DetalhesPacoteComponent }
];

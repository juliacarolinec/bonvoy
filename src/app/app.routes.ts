import { Routes } from '@angular/router';
import { ListaPacotesComponent } from './pages/lista-pacotes/lista-pacotes';
import { DetalhesPacoteComponent } from './pages/detalhes-pacote/detalhes-pacote';

export const routes: Routes = [
    { path: '', redirectTo: 'pacotes', pathMatch: 'full' },
    { path: 'pacotes', component: ListaPacotesComponent },
    { path: 'pacotes/:id', component: DetalhesPacoteComponent }
];

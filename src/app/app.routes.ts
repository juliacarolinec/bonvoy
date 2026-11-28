import { Routes } from '@angular/router';
import { ListaPacotesComponent } from './pages/lista-pacotes/lista-pacotes';
import { DetalhesPacoteComponent } from './pages/detalhes-pacote/detalhes-pacote';
import { HomeComponent } from './pages/home/home';
import { formularioPacoteRoutes } from './pages/formulario-pacote/formulario-pacote.routes'; import { LoginComponent } from './pages/login/login';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { loginGuard } from './guards/login.guard';
import { PerfilComponent } from './pages/perfil/perfil';

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'pacotes', component: ListaPacotesComponent },
    ...formularioPacoteRoutes,
    { path: 'pacotes/:id', component: DetalhesPacoteComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'perfil', component: PerfilComponent, canActivate: [loginGuard] }
];


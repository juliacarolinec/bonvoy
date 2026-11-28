import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessaoEquipeService } from '../services/sessao-equipe';

export const loginGuard: CanActivateFn = () => {
    const sessao = inject(SessaoEquipeService);

    return sessao.logada() || inject(Router).createUrlTree(['/login']);
};
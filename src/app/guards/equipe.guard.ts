import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessaoEquipeService } from '../services/sessao-equipe';

export const equipeGuard: CanActivateFn = () => {
  const sessao = inject(SessaoEquipeService);

  if (sessao.ehEquipe()) return true;

  return inject(Router).createUrlTree([
    sessao.logada() ? '/pacotes' : '/login',
  ]);
};
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Sin token → redirige a Keycloak para hacer login.
  // Tras el login exitoso, Keycloak devolverá al usuario
  // a la URL que intentaba visitar (redirectUri).
  auth.login();
  return false;
};

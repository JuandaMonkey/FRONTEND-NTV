import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Permitir acceso a rutas de autenticación
  if (state.url.includes('/login') || state.url.includes('/register')) {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (authService.isAuthenticated()) {
      return router.parseUrl('/dashboard');
    }
    return true;
  }

  // Para otras rutas, verificar autenticación
  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar la URL a la que intentó acceder
  authService.redirectUrl = state.url;
  return router.parseUrl('/login');
};

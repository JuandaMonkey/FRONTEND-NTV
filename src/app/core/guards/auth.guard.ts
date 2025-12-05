import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Rutas públicas (accesibles sin autenticación)
const PUBLIC_ROUTES = ['/login', '/register'];

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUrl = state.url.split('?')[0];
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    currentUrl === route || currentUrl.startsWith(`${route}/`)
  );
  const isAuthenticated = authService.isAuthenticated();
  
  console.log('AuthGuard:', { 
    currentUrl, 
    isPublicRoute, 
    isAuthenticated,
    publicRoutes: PUBLIC_ROUTES
  });

  // 1. Si es una ruta pública
  if (isPublicRoute) {
    // Si el usuario YA está autenticado, redirigir al dashboard
    if (isAuthenticated) {
      console.log('Redirigiendo a dashboard desde ruta pública');
      return router.createUrlTree(['/dashboard']);
    }
    // Si NO está autenticado, permitir acceso
    console.log('Permitiendo acceso a ruta pública');
    return true;
  }
  
  // 2. Si no es una ruta pública
  // Si el usuario NO está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('Redirigiendo a login desde ruta protegida');
    authService.redirectUrl = currentUrl;
    return router.createUrlTree(['/login']);
  }
  
  // 3. Usuario autenticado intentando acceder a una ruta protegida
  console.log('Permitiendo acceso a ruta protegida');
  return true;
};

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login/login.component';
import { RegisterComponent } from './pages/login-component/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { EncryptComponent } from './features/security/pages/encrypt/encrypt.component';
import { DecryptComponent } from './features/security/pages/decrypt/decrypt.component';

export const routes: Routes = [
  // Ruta por defecto
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  
  // Rutas públicas
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [() => !localStorage.getItem('currentUser') ? true : false]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [() => !localStorage.getItem('currentUser') ? true : false]
  },
  
  // Ruta del dashboard (protegida)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  
  // Rutas de seguridad (protegidas)
  {
    path: 'security',
    children: [
      {
        path: 'encrypt',
        component: EncryptComponent,
        canActivate: [authGuard],
        data: { title: 'Encriptar' }
      },
      {
        path: 'decrypt',
        component: DecryptComponent,
        canActivate: [authGuard],
        data: { title: 'Desencriptar' }
      },
      {
        path: '',
        redirectTo: 'encrypt',
        pathMatch: 'full'
      }
    ]
  },
  
  // Redirigir rutas desconocidas al dashboard si está autenticado, de lo contrario al login
  { 
    path: '**', 
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

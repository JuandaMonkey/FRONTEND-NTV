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
    redirectTo: 'login',
    pathMatch: 'full' 
  },
  
  // Rutas públicas
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [authGuard]
  },
  
  // Ruta del dashboard (protegida)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  
  // Redirigir rutas desconocidas al login
  { 
    path: '**', 
    redirectTo: 'login'
  }
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login/login.component';
import { RegisterComponent } from './pages/login-component/register/register.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Redirección de la raíz
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
  
  // Ejemplo de ruta protegida (debes crear este módulo o reemplazarlo con tus rutas reales)
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
  //   canActivate: [authGuard]
  // },
  
  // Redirección para rutas no encontradas
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    enableTracing: false, // Cambiar a true para depuración de rutas
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

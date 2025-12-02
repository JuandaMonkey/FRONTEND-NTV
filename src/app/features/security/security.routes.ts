import { Routes } from '@angular/router';
import { EncryptComponent } from './pages/encrypt/encrypt.component';
import { DecryptComponent } from './pages/decrypt/decrypt.component';
import { authGuard } from '../../core/guards/auth.guard';

export const SECURITY_ROUTES: Routes = [
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
];

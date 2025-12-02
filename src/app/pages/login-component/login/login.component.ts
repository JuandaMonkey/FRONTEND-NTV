import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      remember: [false]
    });
  }

  // Propiedad de conveniencia para acceder a los controles del formulario
  get f() { return this.loginForm.controls; }

  /**
   * Maneja el envío del formulario de inicio de sesión
   */
  onSubmit() {
    // Marcar todos los campos como tocados para mostrar errores
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const { correo, contrasena, remember } = this.loginForm.value;

    this.authService.login({ correo, contrasena })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          // Si el usuario marcó "Recordar sesión", guardamos el token en localStorage
          if (remember) {
            // El servicio de autenticación ya maneja esto internamente
          }
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = error.error?.mensaje || 'Credenciales inválidas. Por favor, verifica tus datos e intenta nuevamente.';
          console.error('Error en el inicio de sesión:', error);
        }
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

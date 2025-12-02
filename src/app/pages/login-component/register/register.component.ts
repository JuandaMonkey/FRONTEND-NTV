import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

// Validador personalizado para verificar que las contraseñas coincidan
export function matchPassword(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['notSame']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ notSame: true });
      return { notSame: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar el formulario con validaciones
    this.registerForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]],
      confirmarContrasena: ['', Validators.required],
      terminos: [false, Validators.requiredTrue]
    }, { 
      validators: matchPassword('contrasena', 'confirmarContrasena')
    });
  }

  // Propiedad de conveniencia para acceder a los controles del formulario
  get f() { return this.registerForm.controls; }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmit() {
    // Mark all fields as touched to show validation errors
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const { nombre, correo, contrasena, confirmarContrasena } = this.registerForm.value;

    // Ensure passwords match before sending to server
    if (contrasena !== confirmarContrasena) {
      this.error = 'Las contraseñas no coinciden';
      this.loading = false;
      return;
    }

    // Prepare user data in the format expected by the backend
    const userData = {
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      contrasena: contrasena
    };

    this.authService.register(userData)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.success = '¡Registro exitoso! Redirigiendo al login...';
          // The navigation is now handled in the auth service
        },
        error: (error) => {
          // Handle different types of errors
          if (error.status === 400) {
            // Bad request - show validation errors from server
            const serverError = error.error;
            if (serverError && serverError.errors) {
              // Handle validation errors
              const errorMessages = [];
              for (const key in serverError.errors) {
                if (serverError.errors.hasOwnProperty(key)) {
                  errorMessages.push(serverError.errors[key].join(' '));
                }
              }
              this.error = errorMessages.join(' ');
            } else {
              this.error = serverError?.message || 'Error en los datos del formulario';
            }
          } else {
            this.error = error.message || 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
          }
          console.error('Registration error:', error);
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

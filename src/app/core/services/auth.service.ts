import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  user: any;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clienteUrl = 'https://localhost:7153/api/Cliente';
  private authUrl = 'https://localhost:7153/api/Auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.clienteUrl}/crear`, user).pipe(
      tap((response: any) => {
        // If registration is successful, redirect to login
        this.router.navigate(['/login'], { 
          queryParams: { registered: true } 
        });
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al registrar el usuario';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = error.error?.message || error.statusText;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(credentials: { correo: string, contrasena: string }): Observable<AuthResponse> {
    this.errorMessage = '';
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorMessage = 'Correo o contraseña inválidos';
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        }
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  logout() {
    const token = this.currentUserValue?.token;
    if (token) {
      this.http.post(`${this.authUrl}/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: () => {
          this.clearSession();
        },
        error: () => {
          this.clearSession();
        }
      });
    } else {
      this.clearSession();
    }
  }

  private clearSession() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;
    return !!(currentUser && currentUser.token);
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
    }
    this.errorMessage = errorMessage;
    return throwError(() => new Error(errorMessage));
  }
}

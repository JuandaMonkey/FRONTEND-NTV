import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

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
  private clienteUrl = 'https://nakistv-web-service.onrender.com/api/Cliente';
  private authUrl = 'https://nakistv-web-service.onrender.com/api/Auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public errorMessage: string = '';
  private sessionId: string | null = null;
  private readonly SESSION_KEY = 'currentSession';
  private navigationInProgress = false;
  public redirectUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.setupNavigationHandling();
    this.initializeSession();
  }

  private initializeSession() {
    const sessionData = sessionStorage.getItem(this.SESSION_KEY);
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        if (this.isTokenValid(user?.token)) {
          this.sessionId = user.sessionId;
          this.currentUserSubject.next(user);
          return true;
        }
      } catch (e) {
        console.error('Error al analizar los datos de sesión:', e);
      }
    }
    this.clearSession();
    return false;
  }

  private isTokenValid(token: string): boolean {
    if (!token) return false;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch (e) {
      return false;
    }
  }

  private setupNavigationHandling() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigationInProgress = true;
      } else if (event instanceof NavigationEnd) {
        this.navigationInProgress = false;
      }
    });
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
          const userData = {
            ...response,
            sessionId: 'sess_' + Date.now() + Math.random().toString(36).substr(2, 9)
          };
          this.saveSession(userData);
          this.currentUserSubject.next(userData);
          
          // Redirigir a la URL guardada o al dashboard por defecto
          const redirectUrl = this.redirectUrl || '/dashboard';
          this.redirectUrl = null;
          this.router.navigateByUrl(redirectUrl);
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

  private saveSession(userData: any) {
    this.sessionId = userData.sessionId;
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(userData));
    
    // Configurar limpieza solo cuando se cierre la pestaña
    window.removeEventListener('beforeunload', this.clearSession);
    window.addEventListener('beforeunload', () => {
      if (document.visibilityState === 'hidden') {
        this.clearSession();
      }
    });
  }

  clearSession = () => {
    // No limpiar si es una navegación interna
    if (this.navigationInProgress) {
      this.navigationInProgress = false;
      return;
    }

    const currentPath = this.router.url;
    sessionStorage.removeItem(this.SESSION_KEY);
    this.sessionId = null;
    this.currentUserSubject.next(null);
    
    // Solo navegar al login si no estamos ya ahí
    if (!currentPath.startsWith('/login')) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    const token = this.currentUserValue?.token;
    if (token) {
      this.http.post(`${this.authUrl}/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession()
      });
    } else {
      this.clearSession();
    }
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    // Verificar primero en el Subject actual (estado en memoria)
    if (this.currentUserValue?.token && this.isTokenValid(this.currentUserValue.token)) {
      return true;
    }

    // Si no hay en memoria, verificar en sessionStorage
    const sessionData = sessionStorage.getItem(this.SESSION_KEY);
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        if (user?.token && this.isTokenValid(user.token)) {
          // Sincronizar con el Subject
          this.currentUserSubject.next(user);
          return true;
        }
      } catch (e) {
        console.error('Error al verificar la sesión:', e);
      }
    }
    
    // Si llegamos aquí, no hay sesión válida
    this.clearSession();
    return false;
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

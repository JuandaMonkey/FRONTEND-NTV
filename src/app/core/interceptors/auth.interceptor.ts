import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentUser = this.authService.currentUserValue;
    const isApiUrl = request.url.startsWith('https://localhost:7153/api');
    const isRegisterRequest = request.url.includes('/Cliente/crear');

    // Only add the token to non-registration API requests
    if (currentUser?.token && isApiUrl && !isRegisterRequest) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
    } else if (isApiUrl) {
      // For API requests without auth (like registration), ensure proper headers
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle authentication errors
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: this.router.url } 
          });
        }
        
        // For 400 errors, pass through the full error object for better handling in components
        if (error.status === 400) {
          return throwError(() => ({
            status: error.status,
            error: error.error,
            message: error.error?.message || 'Error de validación'
          }));
        }
        
        // For other errors, include the status and error details
        return throwError(() => ({
          status: error.status,
          message: error.error?.message || error.statusText || 'Error desconocido',
          error: error.error
        }));
      })
    );
  }
}

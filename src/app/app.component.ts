import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nakisTV';
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario está autenticado al cargar la aplicación
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user?.token;
    });
  }

  // Método para verificar si la ruta actual es la de login o registro
  isAuthPage(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}

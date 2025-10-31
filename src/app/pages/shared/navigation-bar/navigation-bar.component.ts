import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// componentes
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MyAccountComponent } from '../my-account/my-account.component';
import { ButtonComponent } from '../components/button/button.component';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, 
            SearchBarComponent,
            MyAccountComponent,
            ButtonComponent],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  constructor(private router: Router) {}

  @Input() fixed: boolean = false;

  search(value: string) {
    console.log('Buscar:', value);
  }

  navigateToHome() {
    this.router.navigate(['']);
    console.log('Navegando para Home');
  }

  navigateToShorts() {
    this.router.navigate(['short-page']);
    console.log('Navegando para Shorts');
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// search-bar component
import { SearchBarComponent } from '../search-bar/search-bar.component';

// button component
import { ButtonComponent } from '../components/button/button.component';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, 
            SearchBarComponent, 
            ButtonComponent],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  search(value: string) {
    console.log('Buscar:', value);
  }

  shorts() {
    console.log('Shorts clickeado');
  }

  cortos() {
    console.log('Cortometrajes clickeado');
  }
}

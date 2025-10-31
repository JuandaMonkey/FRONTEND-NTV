import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {
  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation(); 
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.my-account')) {
      this.isDropdownOpen = false;
    }
  }

  logout(event: Event) {
    event.stopPropagation();
    console.log('Cerrando sesión...');
  }
}

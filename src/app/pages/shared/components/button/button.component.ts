import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = ''; 
  @Input() type: 'primary' | 'secondary' | 'danger' | 'warning' | 'control-up' | 'control-down' = 'primary';
  @Input() ariaLabel: string = '';
  @Output() clickBtn = new EventEmitter<void>();

  click() {
    this.clickBtn.emit();
  }
}

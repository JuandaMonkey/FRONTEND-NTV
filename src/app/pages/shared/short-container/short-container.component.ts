import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// componentes
import { ShortCardComponent } from '../short-card/short-card.component';

@Component({
  selector: 'app-short-container',
  standalone: true,
  imports: [CommonModule,
            ShortCardComponent],
  templateUrl: './short-container.component.html',
  styleUrls: ['./short-container.component.scss']
})
export class ShortContainerComponent {
  @Input() title: string = '';
  @Input() movies: any[] = [];
}

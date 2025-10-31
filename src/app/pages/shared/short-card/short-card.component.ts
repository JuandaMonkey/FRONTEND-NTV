import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-short-card',
  standalone: true,
  templateUrl: './short-card.component.html',
  styleUrls: ['./short-card.component.scss']
})
export class ShortCardComponent {
  @Input() title: string = '';
  @Input() imageUrl: string = '';
}

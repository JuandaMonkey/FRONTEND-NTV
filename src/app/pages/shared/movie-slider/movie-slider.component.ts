import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// componentes
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-slider',
  standalone: true,
  imports: [CommonModule, 
            MovieCardComponent],
  templateUrl: './movie-slider.component.html',
  styleUrls: ['./movie-slider.component.scss']
})
export class MovieSliderComponent {
  @Input() title: string = '';
  @Input() movies: any[] = [];

  @ViewChild('carousel') carousel!: ElementRef;

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({
      left: -500,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({
      left: 500,
      behavior: 'smooth'
    });
  }
}

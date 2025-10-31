import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// componentes
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-container',
  standalone: true,
  imports: [CommonModule, 
            MovieCardComponent],
  templateUrl: './movie-container.component.html',
  styleUrls: ['./movie-container.component.scss']
})
export class MovieContainerComponent {
  @Input() title: string = '';
  @Input() movies: any[] = [];

  visibleMovies: any[] = [];
  hiddenMovies: any[] = [];

  private rowsToShow = 4; 
  private currentRows = 4; 

  ngOnInit() {
    this.updateVisibleMovies();
  }

  private updateVisibleMovies() {
    const count = this.currentRows * this.rowsToShow;
    this.visibleMovies = this.movies.slice(0, count);
    this.hiddenMovies = this.movies.slice(count);
  }

  showMore() {
    this.currentRows += 1;
    this.updateVisibleMovies();
  }
}

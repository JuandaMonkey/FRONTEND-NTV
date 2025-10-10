import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// navigation-bar component
import { NavigationBarComponent } from './pages/shared/navigation-bar/navigation-bar.component';

// movie-card component 
import { MovieCardComponent } from './pages/shared/movie-card/movie-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
            CommonModule,
            NavigationBarComponent,
            MovieCardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nakisTV';

  movies = [
    {
      title: 'Gran Turismo',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjA0N2YyNmYtZDk4Ny00ODE2LThmZWQtNGJiMDk0YzhiNzE5XkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      title: 'Demon Slayer: Kimetsu no Yaiba',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMWU1OGEwNmQtNGM3MS00YTYyLThmYmMtN2FjYzQzNzNmNTE0XkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      title: 'The Fall Guy',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BM2U0MTJiYTItMjNiZS00MzU4LTkxYTAtYTU0ZGY1ODJhMjRhXkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      title: 'Minecraft',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BZDc2ZjFlZTEtYWFjOS00OWQzLTlhODMtN2QwYmY4MzYyZDQ4XkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      title: 'Dexter',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTQ3YmQ4YzMtOTkyZC00YmM5LThhZjEtM2E0MjFkNTc0OGJhXkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      title: 'Dexter',
      imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTQ3YmQ4YzMtOTkyZC00YmM5LThhZjEtM2E0MjFkNTc0OGJhXkEyXkFqcGc@._V1_SX300.jpg'
    }
  ];
}

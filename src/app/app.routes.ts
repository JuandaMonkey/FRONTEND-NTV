import { Routes } from '@angular/router';

// componentes
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ShortPageComponent } from './pages/short-page/short-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent, pathMatch: 'full' },
    { path: 'short-page', component: ShortPageComponent },
    { path: '**', redirectTo: '' }
];

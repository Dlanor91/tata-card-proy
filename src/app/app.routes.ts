import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home-page' },
  {
    path: 'home-page',
    loadComponent: () =>
      import('./home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  { path: '**', redirectTo: 'home-page' },
];

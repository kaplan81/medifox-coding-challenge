import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.routes').then((feature) => feature.routes),
  },
  {
    path: 'people',
    loadChildren: () => import('../people/people.routes').then((feature) => feature.routes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'people',
  },
  {
    path: '**',
    redirectTo: 'people',
  },
];

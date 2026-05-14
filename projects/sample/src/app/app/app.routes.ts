import { Routes } from '@angular/router';

export const routes: Routes = [
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

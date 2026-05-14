import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/people-list/people-list.component').then((m) => m.PeopleListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./containers/people-detail/people-detail.component').then(
        (m) => m.PeopleDetailComponent,
      ),
  },
];

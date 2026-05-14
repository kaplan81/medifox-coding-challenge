import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { catchError, map, merge, of, switchMap } from 'rxjs';

import type { SwapiPerson } from '../../models/swapi-person.model';
import { LocalPeopleStore } from '../../services/local-people/local-people.service';
import { SwapiPeopleService } from '../../services/swap-people/swapi-people.service';
import { isLocalPersonId } from '../../utils/swapi-person/swapi-person.util';

type PeopleDetailState =
  | { status: 'error' }
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; person: SwapiPerson };

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterLink,
  ],
  selector: 'smp-people-detail',
  standalone: true,
  styleUrls: ['./people-detail.component.scss'],
  templateUrl: './people-detail.component.html',
})
export class PeopleDetailComponent {
  #destroyRef = inject(DestroyRef);
  #route = inject(ActivatedRoute);
  #store = inject(LocalPeopleStore);
  #swapi = inject(SwapiPeopleService);
  initial = computed(() => {
    const current = this.state();
    if (current.status !== 'ready') {
      return '?';
    }
    return current.person.name.trim().charAt(0).toUpperCase() || '?';
  });
  isLocal = computed(() => {
    const current = this.state();
    if (current.status !== 'ready') {
      return false;
    }
    const url: string = current.person.url;
    const id: string = url.split('/').filter(Boolean).pop() ?? '';
    return isLocalPersonId(id);
  });
  state = signal<PeopleDetailState>({ status: 'loading' });

  constructor() {
    this.#route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        switchMap((id: string) => {
          if (!id) {
            return of<PeopleDetailState>({ status: 'not-found' });
          }
          if (isLocalPersonId(id)) {
            const person = this.#store.getByRouteId(id);
            return of<PeopleDetailState>(
              person ? { person, status: 'ready' } : { status: 'not-found' },
            );
          }
          return merge(
            of<PeopleDetailState>({ status: 'loading' }),
            this.#swapi.getById(id).pipe(
              map((person: SwapiPerson): PeopleDetailState => ({ person, status: 'ready' })),
              catchError(() => of<PeopleDetailState>({ status: 'error' })),
            ),
          );
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((nextState: PeopleDetailState) => {
        this.state.set(nextState);
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Signal,
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

import { map } from 'rxjs';

import type { SwapiPerson } from '../../models/swapi-person.model';
import { PeopleStateService } from '../../services/people-state/people-state.service';
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
  #peopleStateService = inject(PeopleStateService);
  #route = inject(ActivatedRoute);
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
  routeId = signal<string>('');
  state: Signal<PeopleDetailState> = computed<PeopleDetailState>(() => {
    const id: string = this.routeId();
    if (id === '') {
      return { status: 'not-found' };
    }
    const person: SwapiPerson | null = this.#peopleStateService.getByRouteId(id);
    if (person !== null) {
      return { person, status: 'ready' };
    }
    if (!isLocalPersonId(id) && this.#peopleStateService.loadState() === 'loading') {
      return { status: 'loading' };
    }
    if (!isLocalPersonId(id) && this.#peopleStateService.loadState() === 'error') {
      return { status: 'error' };
    }
    return { status: 'not-found' };
  });

  constructor() {
    this.#route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((id: string) => {
        this.routeId.set(id);
        if (id !== '' && !isLocalPersonId(id)) {
          this.#peopleStateService.loadAll();
        }
      });
  }
}

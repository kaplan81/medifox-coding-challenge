import { Dialog } from '@angular/cdk/dialog';
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
import { RouterLink } from '@angular/router';

import { AddPersonDialogComponent } from '../../components/add-person-dialog/add-person-dialog.component';
import type { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { LocalPeopleStateService } from '../../services/local-people-state/local-people-state.service';
import { SwapiPeopleService } from '../../services/swap-people/swapi-people.service';
import { extractPersonRouteId, isLocalPersonId } from '../../utils/swapi-person/swapi-person.util';

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
  selector: 'smp-people-list',
  standalone: true,
  styleUrls: ['./people-list.component.scss'],
  templateUrl: './people-list.component.html',
})
export class PeopleListComponent {
  #destroyRef = inject(DestroyRef);
  #dialog = inject(Dialog);
  #store = inject(LocalPeopleStateService);
  #swapi = inject(SwapiPeopleService);
  loadState = signal<'error' | 'loading' | 'ready'>('loading');
  localCount = computed(() => this.#store.localPeople().length);
  mergedPeople = computed(() => this.#store.mergedWithRemote(this.remotePeople()));
  readonly isLocal = isLocalPersonId;
  readonly routeIdFor = extractPersonRouteId;
  remotePeople = signal<SwapiPerson[]>([]);

  constructor() {
    this.#swapi
      .getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        error: () => {
          this.loadState.set('error');
        },
        next: (list: SwapiPerson[]) => {
          this.remotePeople.set(list);
          this.loadState.set('ready');
        },
      });
  }

  initialFor(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?';
  }

  openAddDialog(): void {
    const ref = this.#dialog.open<NewPersonFields, void, AddPersonDialogComponent>(
      AddPersonDialogComponent,
      {
        ariaLabel: 'Add a new character',
        disableClose: false,
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        panelClass: 'add-person-dialog-panel',
      },
    );
    ref.closed.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((result) => {
      if (result !== undefined) {
        this.#store.add(result);
      }
    });
  }
}

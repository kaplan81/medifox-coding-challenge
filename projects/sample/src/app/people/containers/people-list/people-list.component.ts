import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { AddPersonDialogComponent } from '../../components/add-person-dialog/add-person-dialog.component';
import type { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { PeopleLoadState, PeopleStateService } from '../../services/people-state/people-state.service';
import { extractPersonRouteId, isLocalPersonId } from '../../utils/swapi-person/swapi-person.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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
  #peopleStateService = inject(PeopleStateService);
  filteredCount: Signal<number> = this.#peopleStateService.filteredCount;
  filteredPeople: Signal<SwapiPerson[]> = this.#peopleStateService.filteredPeople;
  readonly isLocal = isLocalPersonId;
  loadState: Signal<PeopleLoadState> = this.#peopleStateService.loadState;
  localCount: Signal<number> = this.#peopleStateService.localCount;
  readonly routeIdFor = extractPersonRouteId;
  searchTerm: Signal<string> = this.#peopleStateService.searchTerm;
  totalCount: Signal<number> = this.#peopleStateService.totalCount;

  constructor() {
    this.#peopleStateService.loadAll();
  }

  clearSearch(): void {
    this.#peopleStateService.setSearchTerm('');
  }

  deletePerson(routeId: string): void {
    this.#peopleStateService.remove(routeId);
  }

  initialFor(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?';
  }

  onSearch(event: Event): void {
    const target: EventTarget | null = event.target;
    if (target instanceof HTMLInputElement) {
      this.#peopleStateService.setSearchTerm(target.value);
    }
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
        this.#peopleStateService.add(result);
      }
    });
  }
}

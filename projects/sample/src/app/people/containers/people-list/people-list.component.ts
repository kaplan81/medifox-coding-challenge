import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import type { SwapiPerson } from '../../models/swapi-person.model';
import { LocalPeopleStore } from '../../services/local-people.store';
import { SwapiPeopleService } from '../../services/swapi-people.service';
import { extractPersonRouteId } from '../../utils/swapi-person.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'smp-people-list',
  standalone: true,
  styleUrls: ['./people-list.component.scss'],
  templateUrl: './people-list.component.html',
})
export class PeopleListComponent {
  #destroyRef = inject(DestroyRef);
  #fb = inject(FormBuilder);
  #store = inject(LocalPeopleStore);
  #swapi = inject(SwapiPeopleService);
  addForm = this.#fb.nonNullable.group({
    birth_year: ['', Validators.required],
    gender: ['', Validators.required],
    height: ['', Validators.required],
    mass: ['', Validators.required],
    name: ['', Validators.required],
  });
  loadState = signal<'error' | 'loading' | 'ready'>('loading');
  mergedPeople = computed(() => {
    this.#store.localPeople();
    return this.#store.mergedWithRemote(this.remotePeople());
  });
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

  onAddSubmit(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    this.#store.add(this.addForm.getRawValue());
    this.addForm.reset();
  }
}

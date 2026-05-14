import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';

import { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { isLocalPersonId } from '../../utils/swapi-person/swapi-person.util';
import { LocalPeopleStateService } from '../local-people-state/local-people-state.service';
import { SwapiPeopleStateService } from '../swapi-people-state/swapi-people-state.service';

export type PeopleLoadState = 'error' | 'loading' | 'ready';

@Injectable({
  providedIn: 'root',
})
export class PeopleStateService {
  #localPeopleStateService = inject(LocalPeopleStateService);
  #swapiPeopleStateService = inject(SwapiPeopleStateService);
  #searchTerm: WritableSignal<string> = signal<string>('');
  readonly filteredCount: Signal<number> = computed<number>(() => this.filteredPeople().length);
  readonly filteredPeople: Signal<SwapiPerson[]> = computed<SwapiPerson[]>(() => {
    const term: string = this.searchTerm().trim().toLowerCase();
    if (term === '') {
      return this.people();
    }
    return this.people().filter((person: SwapiPerson) =>
      person.name.toLowerCase().includes(term),
    );
  });
  readonly loadState: Signal<PeopleLoadState> = computed<PeopleLoadState>(() => {
    if (this.#swapiPeopleStateService.error()) {
      return 'error';
    }
    if (this.#swapiPeopleStateService.loading() || !this.#swapiPeopleStateService.loaded()) {
      return 'loading';
    }
    return 'ready';
  });
  readonly localCount: Signal<number> = computed<number>(
    () => this.#localPeopleStateService.localPeople().length,
  );
  readonly people: Signal<SwapiPerson[]> = computed<SwapiPerson[]>(() =>
    [
      ...this.#swapiPeopleStateService.people(),
      ...this.#localPeopleStateService.localPeople(),
    ].sort((a: SwapiPerson, b: SwapiPerson) => a.name.localeCompare(b.name)),
  );
  readonly searchTerm: Signal<string> = this.#searchTerm.asReadonly();
  readonly totalCount: Signal<number> = computed<number>(() => this.people().length);

  add(fields: NewPersonFields): string {
    return this.#localPeopleStateService.add(fields);
  }

  getByRouteId(routeId: string): SwapiPerson | null {
    if (isLocalPersonId(routeId)) {
      return this.#localPeopleStateService.getByRouteId(routeId);
    }
    return this.#swapiPeopleStateService.getByRouteId(routeId);
  }

  loadAll(): void {
    this.#swapiPeopleStateService.loadAll();
  }

  remove(routeId: string): void {
    if (isLocalPersonId(routeId)) {
      this.#localPeopleStateService.remove(routeId);
      return;
    }
    this.#swapiPeopleStateService.remove(routeId);
  }

  setSearchTerm(term: string): void {
    this.#searchTerm.set(term);
  }
}

import { Injectable, Signal, computed, inject } from '@angular/core';

import { take } from 'rxjs';

import { emptyBase } from '../../../app/mixins/empty';
import { StateMixin } from '../../../app/mixins/state/state.mixin';
import { Entities } from '../../../app/models/state.model';
import { SwapiPerson } from '../../models/swapi-person.model';
import { extractPersonRouteId } from '../../utils/swapi-person/swapi-person.util';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';
import { initialSwapiPeopleState } from './swapi-people-state.initial';

@Injectable({
  providedIn: 'root',
})
export class SwapiPeopleStateService extends StateMixin(emptyBase, initialSwapiPeopleState) {
  #swapiPeopleService = inject(SwapiPeopleService);
  readonly error: Signal<boolean> = computed<boolean>(() => this.state().error);
  readonly loaded: Signal<boolean> = computed<boolean>(() => this.state().loaded);
  readonly loading: Signal<boolean> = computed<boolean>(() => this.state().loading);
  readonly people: Signal<SwapiPerson[]> = computed<SwapiPerson[]>(() => {
    const entities: Entities<SwapiPerson> | null = this.state().entities;
    if (entities === null) {
      return [];
    }
    return this.state().ids.map((id: string | number) => entities[id]);
  });

  getByRouteId(routeId: string): SwapiPerson | null {
    return this.state().entities?.[routeId] ?? null;
  }

  loadAll(): void {
    if (this.loading() || this.loaded()) {
      return;
    }
    this.updateState({
      ...this.state(),
      error: false,
      loading: true,
    });
    this.#swapiPeopleService
      .getAll()
      .pipe(take(1))
      .subscribe({
        error: () => {
          this.updateState({
            ...this.state(),
            error: true,
            loaded: false,
            loading: false,
          });
        },
        next: (people: SwapiPerson[]) => {
          this.updateState({
            entities: this.#toEntities(people),
            error: false,
            ids: people.map((person: SwapiPerson) => extractPersonRouteId(person)),
            loaded: true,
            loading: false,
          });
        },
      });
  }

  remove(routeId: string): void {
    const entities: Entities<SwapiPerson> | null = this.state().entities;
    if (entities === null || entities[routeId] === undefined) {
      return;
    }
    const nextEntities: Entities<SwapiPerson> = { ...entities };
    delete nextEntities[routeId];
    const ids: (string | number)[] = this.state().ids.filter((id: string | number) => id !== routeId);
    this.updateState({
      ...this.state(),
      entities: ids.length > 0 ? nextEntities : null,
      ids,
    });
  }

  #toEntities(people: SwapiPerson[]): Entities<SwapiPerson> {
    return people.reduce((entities: Entities<SwapiPerson>, person: SwapiPerson) => {
      entities[extractPersonRouteId(person)] = person;
      return entities;
    }, {});
  }
}

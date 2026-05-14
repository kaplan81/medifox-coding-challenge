import { Injectable, Signal, computed } from '@angular/core';

import { emptyBase } from '../../../app/mixins/empty';
import { StateMixin } from '../../../app/mixins/state/state.mixin';
import { Entities } from '../../../app/models/state.model';
import { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';
import { initialLocalPeopleState } from './local-people-state.initial';

@Injectable({
  providedIn: 'root',
})
export class LocalPeopleStateService extends StateMixin(emptyBase, initialLocalPeopleState) {
  readonly localPeople: Signal<SwapiPerson[]> = computed<SwapiPerson[]>(() => {
    const entities: Entities<SwapiPerson> | null = this.state().entities;
    if (entities === null) {
      return [];
    }
    return this.state().ids.map((id: string | number) => entities[id]);
  });

  add(fields: NewPersonFields): string {
    const id: string = `local-${crypto.randomUUID()}`;
    const entities: Entities<SwapiPerson> = this.state().entities ?? {};
    const person: SwapiPerson = {
      ...fields,
      url: `${SwapiPeopleService.apiUrl}/${id}`,
    };
    this.updateState({
      entities: {
        ...entities,
        [id]: person,
      },
      ids: [...this.state().ids, id],
    });
    return id;
  }

  getByRouteId(routeId: string): SwapiPerson | null {
    return this.state().entities?.[routeId] ?? null;
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
      entities: ids.length > 0 ? nextEntities : null,
      ids,
    });
  }
}

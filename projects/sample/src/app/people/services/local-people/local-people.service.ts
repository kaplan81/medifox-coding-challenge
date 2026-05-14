import { Injectable, signal } from '@angular/core';

import {
  NewPersonFields,
  SWAPI_PEOPLE_API_URL,
  SwapiPerson,
} from '../../models/swapi-person.model';
import { extractPersonRouteId } from '../../utils/swapi-person/swapi-person.util';

@Injectable({
  providedIn: 'root',
})
export class LocalPeopleStore {
  #localPeople = signal<SwapiPerson[]>([]);

  readonly localPeople = this.#localPeople.asReadonly();

  add(fields: NewPersonFields): string {
    const id: string = `local-${crypto.randomUUID()}`;
    const person: SwapiPerson = {
      ...fields,
      url: `${SWAPI_PEOPLE_API_URL}/${id}`,
    };
    this.#localPeople.update((list: SwapiPerson[]) => [...list, person]);
    return id;
  }

  getByRouteId(routeId: string): SwapiPerson | null {
    return (
      this.#localPeople().find((person: SwapiPerson) => extractPersonRouteId(person) === routeId) ??
      null
    );
  }

  mergedWithRemote(remote: SwapiPerson[]): SwapiPerson[] {
    return [...remote, ...this.#localPeople()].sort((a: SwapiPerson, b: SwapiPerson) =>
      a.name.localeCompare(b.name),
    );
  }
}

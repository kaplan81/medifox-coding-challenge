import { Injectable, Signal } from '@angular/core';

import { emptyBase } from '../../../app/mixins/empty';
import { StateMixin } from '../../../app/mixins/state/state.mixin';
import { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { extractPersonRouteId } from '../../utils/swapi-person/swapi-person.util';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';

interface LocalPeopleState {
  localPeople: SwapiPerson[];
}

const initialLocalPeopleState: LocalPeopleState = {
  localPeople: [],
};

@Injectable({
  providedIn: 'root',
})
export class LocalPeopleStateService extends StateMixin(emptyBase, initialLocalPeopleState) {
  readonly localPeople: Signal<SwapiPerson[]> = this.getStateProp('localPeople');

  add(fields: NewPersonFields): string {
    const id: string = `local-${crypto.randomUUID()}`;
    const person: SwapiPerson = {
      ...fields,
      url: `${SwapiPeopleService.apiUrl}/${id}`,
    };
    this.updateStateProp('localPeople', [...this.localPeople(), person]);
    return id;
  }

  getByRouteId(routeId: string): SwapiPerson | null {
    return (
      this.localPeople().find((person: SwapiPerson) => extractPersonRouteId(person) === routeId) ??
      null
    );
  }

  mergedWithRemote(remote: SwapiPerson[]): SwapiPerson[] {
    return [...remote, ...this.localPeople()].sort((a: SwapiPerson, b: SwapiPerson) =>
      a.name.localeCompare(b.name),
    );
  }
}

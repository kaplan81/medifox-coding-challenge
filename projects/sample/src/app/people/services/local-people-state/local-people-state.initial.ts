import { SwapiPerson } from '../../models/swapi-person.model';

export interface LocalPeopleState {
  localPeople: SwapiPerson[];
}

export const initialLocalPeopleState: LocalPeopleState = {
  localPeople: [],
};

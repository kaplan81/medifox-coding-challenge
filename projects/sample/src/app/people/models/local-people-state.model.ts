import { EntityState } from '../../app/models/state.model';
import { SwapiPerson } from './swapi-person.model';

export interface LocalPeopleState extends EntityState<SwapiPerson> {}

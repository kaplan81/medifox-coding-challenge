import { EntityState, LoadingState } from '../../app/models/state.model';
import { SwapiPerson } from './swapi-person.model';

export interface SwapiPeopleState extends EntityState<SwapiPerson>, LoadingState {
  error: boolean;
}

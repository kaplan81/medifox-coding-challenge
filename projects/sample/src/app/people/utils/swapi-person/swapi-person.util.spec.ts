import type { SwapiPerson } from '../../models/swapi-person.model';

import { SwapiPeopleService } from '../../services/swap-people/swapi-people.service';
import { extractPersonRouteId, isLocalPersonId } from './swapi-person.util';

const person: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SwapiPeopleService.apiUrl}/1`,
};

describe('extractPersonRouteId()', () => {
  it('should extract the trailing id from a SWAPI person url', () => {
    expect(extractPersonRouteId(person)).toEqual('1');
  });

  it('should ignore a trailing slash', () => {
    expect(
      extractPersonRouteId({
        ...person,
        url: `${SwapiPeopleService.apiUrl}/12/`,
      }),
    ).toEqual('12');
  });
});

describe('isLocalPersonId()', () => {
  it('should return true for local ids', () => {
    expect(isLocalPersonId('local-123')).toBe(true);
  });

  it('should return false for API ids', () => {
    expect(isLocalPersonId('1')).toBe(false);
  });
});

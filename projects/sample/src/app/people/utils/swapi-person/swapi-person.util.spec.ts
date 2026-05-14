import type { SwapiPerson } from '../models/swapi-person.model';
import { SWAPI_PEOPLE_API_URL } from '../models/swapi-person.model';
import { extractPersonRouteId, isLocalPersonId } from './swapi-person.util';

const person: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SWAPI_PEOPLE_API_URL}/1`,
};

describe('extractPersonRouteId()', () => {
  it('should extract the trailing id from a SWAPI person url', () => {
    expect(extractPersonRouteId(person)).toEqual('1');
  });

  it('should ignore a trailing slash', () => {
    expect(
      extractPersonRouteId({
        ...person,
        url: `${SWAPI_PEOPLE_API_URL}/12/`,
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

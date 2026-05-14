import {
  SWAPI_PEOPLE_API_URL,
  SwapiPerson,
  normalizeSwapiPeopleListPayload,
} from './swapi-person.model';

const minimalPerson: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SWAPI_PEOPLE_API_URL}/1`,
};

describe('normalizeSwapiPeopleListPayload()', () => {
  it('should return an empty array for invalid payloads', () => {
    expect(normalizeSwapiPeopleListPayload(null)).toEqual([]);
    expect(normalizeSwapiPeopleListPayload({})).toEqual([]);
  });

  it('should return array payloads as-is', () => {
    expect(normalizeSwapiPeopleListPayload([minimalPerson])).toEqual([minimalPerson]);
  });

  it('should unwrap paged results', () => {
    expect(
      normalizeSwapiPeopleListPayload({
        results: [minimalPerson],
      }),
    ).toEqual([minimalPerson]);
  });
});

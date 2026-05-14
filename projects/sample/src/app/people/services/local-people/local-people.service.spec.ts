import { TestBed } from '@angular/core/testing';

import { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';
import { LocalPeopleStore } from './local-people.service';

describe('LocalPeopleStore', () => {
  let store: LocalPeopleStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(LocalPeopleStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('add()', () => {
    it('should append a person with a local route id', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000001');

      const fields: NewPersonFields = {
        birth_year: '0BBY',
        gender: 'n/a',
        height: '100',
        mass: '100',
        name: 'Test Person',
      };
      const id = store.add(fields);

      expect(id).toEqual('local-00000000-0000-0000-0000-000000000001');

      const local: SwapiPerson[] = store.localPeople();
      expect(local).toHaveLength(1);
      expect(local[0].name).toEqual('Test Person');
      expect(local[0].url).toEqual(
        `${SwapiPeopleService.apiUrl}/local-00000000-0000-0000-0000-000000000001`,
      );
    });
  });

  describe('getByRouteId()', () => {
    it('should return a stored person by route id', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000002');
      const addedId = store.add({
        birth_year: '0BBY',
        gender: 'n/a',
        height: '100',
        mass: '100',
        name: 'Local',
      });

      expect(store.getByRouteId(addedId)?.name).toEqual('Local');
      expect(store.getByRouteId('missing')).toBeNull();
    });
  });

  describe('mergedWithRemote()', () => {
    it('should merge and sort by name', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000003');

      store.add({
        birth_year: '0BBY',
        gender: 'n/a',
        height: '100',
        mass: '100',
        name: 'Zebra',
      });

      const remote: SwapiPerson[] = [
        {
          birth_year: '19BBY',
          gender: 'male',
          height: '172',
          mass: '77',
          name: 'Aaron',
          url: `${SwapiPeopleService.apiUrl}/1`,
        },
      ];

      const names = store.mergedWithRemote(remote).map((p: SwapiPerson) => p.name);
      expect(names).toEqual(['Aaron', 'Zebra']);
    });
  });
});

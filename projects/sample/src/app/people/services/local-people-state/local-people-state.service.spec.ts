import { TestBed, inject } from '@angular/core/testing';

import { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';
import { LocalPeopleStateService } from './local-people-state.service';

describe('LocalPeopleStateService', () => {
  let service: LocalPeopleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalPeopleStateService);
  });

  it(
    'can be instantiated via DI',
    inject([LocalPeopleStateService], (injectedService: LocalPeopleStateService) => {
      expect(injectedService).toEqual(service);
    }),
  );

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
      const id = service.add(fields);

      expect(id).toEqual('local-00000000-0000-0000-0000-000000000001');

      const local: SwapiPerson[] = service.localPeople();
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
      const addedId = service.add({
        birth_year: '0BBY',
        gender: 'n/a',
        height: '100',
        mass: '100',
        name: 'Local',
      });

      expect(service.getByRouteId(addedId)?.name).toEqual('Local');
      expect(service.getByRouteId('missing')).toBeNull();
    });
  });

  describe('remove()', () => {
    it('should remove a stored person by route id', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000003');

      const routeId: string = service.add({
        birth_year: '0BBY',
        gender: 'n/a',
        height: '100',
        mass: '100',
        name: 'Zebra',
      });

      service.remove(routeId);

      expect(service.localPeople()).toEqual([]);
      expect(service.getByRouteId(routeId)).toBeNull();
    });
  });
});

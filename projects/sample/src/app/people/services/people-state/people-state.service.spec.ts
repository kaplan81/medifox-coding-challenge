import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { SwapiPerson } from '../../models/swapi-person.model';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';
import { PeopleStateService } from './people-state.service';

const luke: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SwapiPeopleService.apiUrl}/1`,
};

const leia: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'female',
  height: '150',
  mass: '49',
  name: 'Leia Organa',
  url: `${SwapiPeopleService.apiUrl}/5`,
};

describe('PeopleStateService', () => {
  let httpTestingController: HttpTestingController;
  let service: PeopleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PeopleStateService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it(
    'can be instantiated via DI',
    inject([PeopleStateService], (injectedService: PeopleStateService) => {
      expect(injectedService).toEqual(service);
    }),
  );

  describe('filteredPeople()', () => {
    it('should combine, sort, and filter remote and local people by name', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000001');
      service.loadAll();
      httpTestingController.expectOne(SwapiPeopleService.apiUrl).flush([luke]);
      service.add({
        birth_year: '19BBY',
        gender: 'female',
        height: '150',
        mass: '49',
        name: 'Leia Organa',
      });

      expect(service.people().map((person: SwapiPerson) => person.name)).toEqual([
        'Leia Organa',
        'Luke Skywalker',
      ]);

      service.setSearchTerm('luke');

      expect(service.filteredPeople()).toEqual([luke]);
      expect(service.filteredCount()).toEqual(1);
      expect(service.totalCount()).toEqual(2);
    });
  });

  describe('remove()', () => {
    it('should delegate local and remote deletes to the correct state', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000002');
      service.loadAll();
      httpTestingController.expectOne(SwapiPeopleService.apiUrl).flush([luke, leia]);
      const localId: string = service.add({
        birth_year: '0BBY',
        gender: 'n/a',
        height: '100',
        mass: '100',
        name: 'Local Person',
      });

      service.remove('1');
      service.remove(localId);

      expect(service.people()).toEqual([leia]);
      expect(service.getByRouteId('1')).toBeNull();
      expect(service.getByRouteId(localId)).toBeNull();
    });
  });
});

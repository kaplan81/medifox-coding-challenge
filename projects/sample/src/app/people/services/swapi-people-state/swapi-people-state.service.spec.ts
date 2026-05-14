import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { SwapiPerson } from '../../models/swapi-person.model';
import { SwapiPeopleService } from '../swap-people/swapi-people.service';
import { SwapiPeopleStateService } from './swapi-people-state.service';

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

describe('SwapiPeopleStateService', () => {
  let httpTestingController: HttpTestingController;
  let service: SwapiPeopleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SwapiPeopleStateService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it(
    'can be instantiated via DI',
    inject([SwapiPeopleStateService], (injectedService: SwapiPeopleStateService) => {
      expect(injectedService).toEqual(service);
    }),
  );

  describe('getByRouteId()', () => {
    it('should return a stored person by route id', () => {
      service.loadAll();
      httpTestingController.expectOne(SwapiPeopleService.apiUrl).flush([luke]);

      expect(service.getByRouteId('1')).toEqual(luke);
      expect(service.getByRouteId('missing')).toBeNull();
    });
  });

  describe('loadAll()', () => {
    it('should store SWAPI people as entities', () => {
      service.loadAll();
      httpTestingController.expectOne(SwapiPeopleService.apiUrl).flush([luke, leia]);

      expect(service.loaded()).toBe(true);
      expect(service.loading()).toBe(false);
      expect(service.people()).toEqual([luke, leia]);
      expect(service.state().ids).toEqual(['1', '5']);
    });
  });

  describe('remove()', () => {
    it('should remove a person from state', () => {
      service.loadAll();
      httpTestingController.expectOne(SwapiPeopleService.apiUrl).flush([luke, leia]);

      service.remove('1');

      expect(service.people()).toEqual([leia]);
      expect(service.getByRouteId('1')).toBeNull();
    });
  });
});

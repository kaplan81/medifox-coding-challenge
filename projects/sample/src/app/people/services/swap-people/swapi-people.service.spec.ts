import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { SWAPI_PEOPLE_API_URL, SwapiPerson } from '../models/swapi-person.model';
import { SwapiPeopleService } from './swapi-people.service';

const luke: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SWAPI_PEOPLE_API_URL}/1`,
};

describe('SwapiPeopleService', () => {
  let httpMock: HttpTestingController;
  let service: SwapiPeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SwapiPeopleService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should GET the people collection', async () => {
      const peoplePromise = firstValueFrom(service.getAll());
      httpMock.expectOne(SWAPI_PEOPLE_API_URL).flush([luke]);
      const people: SwapiPerson[] = await peoplePromise;
      expect(people).toEqual([luke]);
    });
  });

  describe('getById()', () => {
    it('should GET a single person', async () => {
      const personPromise = firstValueFrom(service.getById('1'));
      httpMock.expectOne(`${SWAPI_PEOPLE_API_URL}/1`).flush(luke);
      const person: SwapiPerson = await personPromise;
      expect(person).toEqual(luke);
    });
  });
});

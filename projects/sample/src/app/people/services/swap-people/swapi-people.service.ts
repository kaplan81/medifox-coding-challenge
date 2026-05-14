import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import {
  SWAPI_PEOPLE_API_URL,
  SwapiPerson,
  normalizeSwapiPeopleListPayload,
} from '../../models/swapi-person.model';

@Injectable({
  providedIn: 'root',
})
export class SwapiPeopleService {
  #http = inject(HttpClient);

  getAll(): Observable<SwapiPerson[]> {
    return this.#http
      .get<unknown>(SWAPI_PEOPLE_API_URL)
      .pipe(map((raw: unknown) => normalizeSwapiPeopleListPayload(raw)));
  }

  getById(id: string): Observable<SwapiPerson> {
    return this.#http.get<SwapiPerson>(`${SWAPI_PEOPLE_API_URL}/${id}`);
  }
}

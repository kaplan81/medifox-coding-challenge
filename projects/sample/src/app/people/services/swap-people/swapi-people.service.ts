import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';

import { SwapiPerson, normalizeSwapiPeopleListPayload } from '../../models/swapi-person.model';

@Injectable({
  providedIn: 'root',
})
export class SwapiPeopleService {
  static readonly apiUrl = 'https://swapi.info/api/people';

  #http = inject(HttpClient);

  getAll(): Observable<SwapiPerson[]> {
    return this.#http
      .get<unknown>(SwapiPeopleService.apiUrl)
      .pipe(map((raw: unknown) => normalizeSwapiPeopleListPayload(raw)));
  }

  getById(id: string): Observable<SwapiPerson> {
    return this.#http.get<SwapiPerson>(`${SwapiPeopleService.apiUrl}/${id}`);
  }
}

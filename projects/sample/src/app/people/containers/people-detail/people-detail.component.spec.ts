import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { SwapiPerson } from '../../models/swapi-person.model';
import { LocalPeopleStateService } from '../../services/local-people-state/local-people-state.service';
import { SwapiPeopleService } from '../../services/swap-people/swapi-people.service';
import { PeopleDetailComponent } from './people-detail.component';

const luke: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SwapiPeopleService.apiUrl}/1`,
};

describe('PeopleDetailComponent', () => {
  let component: PeopleDetailComponent;
  let fixture: ComponentFixture<PeopleDetailComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${SwapiPeopleService.apiUrl}/1`).flush(luke);
    fixture.detectChanges();
    expect(component.state()).toMatchSnapshot();
  });

  describe('local entries', () => {
    it('should resolve local people from the store', async () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-0000000000aa');

      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [PeopleDetailComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          provideNoopAnimations(),
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of(convertToParamMap({ id: 'local-00000000-0000-0000-0000-0000000000aa' })),
            },
          },
        ],
      }).compileComponents();

      const store = TestBed.inject(LocalPeopleStateService);
      store.add({
        birth_year: '10BBY',
        gender: 'n/a',
        height: '150',
        mass: '50',
        name: 'Local Hero',
      });

      fixture = TestBed.createComponent(PeopleDetailComponent);
      component = fixture.componentInstance;
      httpMock = TestBed.inject(HttpTestingController);
      fixture.detectChanges();

      expect(component.state()).toEqual({
        person: store.getByRouteId('local-00000000-0000-0000-0000-0000000000aa'),
        status: 'ready',
      });
    });
  });
});

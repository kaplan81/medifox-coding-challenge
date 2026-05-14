import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SWAPI_PEOPLE_API_URL, SwapiPerson } from '../../models/swapi-person.model';
import { PeopleListComponent } from './people-list.component';

const luke: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SWAPI_PEOPLE_API_URL}/1`,
};

describe('PeopleListComponent', () => {
  let component: PeopleListComponent;
  let fixture: ComponentFixture<PeopleListComponent>;
  let httpMock: HttpTestingController;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleListComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement as HTMLElement;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    httpMock.expectOne(SWAPI_PEOPLE_API_URL).flush([luke]);
    fixture.detectChanges();
    expect({
      loadState: component.loadState(),
      names: component.mergedPeople().map((p: SwapiPerson) => p.name),
    }).toMatchSnapshot();
    expect(nativeEl.textContent).toContain('Luke Skywalker');
  });

  describe('onAddSubmit()', () => {
    it('should add a valid person to the local store', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000004');
      fixture.detectChanges();
      httpMock.expectOne(SWAPI_PEOPLE_API_URL).flush([luke]);
      fixture.detectChanges();

      component.addForm.setValue({
        birth_year: '1ABY',
        gender: 'female',
        height: '180',
        mass: '70',
        name: 'Leia',
      });
      component.onAddSubmit();

      const names = component
        .mergedPeople()
        .map((p: SwapiPerson) => p.name)
        .filter((n: string) => n === 'Leia');
      expect(names).toEqual(['Leia']);
    });
  });
});

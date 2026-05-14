import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { NewPersonFields, SwapiPerson } from '../../models/swapi-person.model';
import { SwapiPeopleService } from '../../services/swap-people/swapi-people.service';
import { PeopleListComponent } from './people-list.component';

const luke: SwapiPerson = {
  birth_year: '19BBY',
  gender: 'male',
  height: '172',
  mass: '77',
  name: 'Luke Skywalker',
  url: `${SwapiPeopleService.apiUrl}/1`,
};

const leiaFields: NewPersonFields = {
  birth_year: '19BBY',
  gender: 'female',
  height: '150',
  mass: '49',
  name: 'Leia',
};

describe('PeopleListComponent', () => {
  let component: PeopleListComponent;
  let dialogOpenSpy: ReturnType<typeof vi.fn>;
  let fixture: ComponentFixture<PeopleListComponent>;
  let httpMock: HttpTestingController;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    dialogOpenSpy = vi.fn();
    await TestBed.configureTestingModule({
      imports: [PeopleListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([]),
        { provide: Dialog, useValue: { open: dialogOpenSpy } },
      ],
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
    httpMock.expectOne(SwapiPeopleService.apiUrl).flush([luke]);
    fixture.detectChanges();
    expect({
      loadState: component.loadState(),
      names: component.mergedPeople().map((p: SwapiPerson) => p.name),
    }).toMatchSnapshot();
    expect(nativeEl.textContent).toContain('Luke Skywalker');
  });

  describe('openAddDialog()', () => {
    it('should add a returned person to the local store', () => {
      vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000004');
      fixture.detectChanges();
      httpMock.expectOne(SwapiPeopleService.apiUrl).flush([luke]);
      fixture.detectChanges();

      const dialogRefStub = { closed: of(leiaFields) } as unknown as DialogRef<NewPersonFields>;
      dialogOpenSpy.mockReturnValue(dialogRefStub);

      component.openAddDialog();

      expect(dialogOpenSpy).toHaveBeenCalled();
      const names = component
        .mergedPeople()
        .map((p: SwapiPerson) => p.name)
        .filter((n: string) => n === 'Leia');
      expect(names).toEqual(['Leia']);
    });

    it('should not add anything when the dialog is cancelled', () => {
      fixture.detectChanges();
      httpMock.expectOne(SwapiPeopleService.apiUrl).flush([luke]);
      fixture.detectChanges();

      const dialogRefStub = { closed: of(undefined) } as unknown as DialogRef<NewPersonFields>;
      dialogOpenSpy.mockReturnValue(dialogRefStub);

      const sizeBefore = component.mergedPeople().length;
      component.openAddDialog();

      expect(component.mergedPeople()).toHaveLength(sizeBefore);
    });
  });
});

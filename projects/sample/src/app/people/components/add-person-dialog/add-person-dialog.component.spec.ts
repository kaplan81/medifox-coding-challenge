import { DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { AddPersonDialogComponent } from './add-person-dialog.component';

describe('AddPersonDialogComponent', () => {
  let component: AddPersonDialogComponent;
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };
  let fixture: ComponentFixture<AddPersonDialogComponent>;

  beforeEach(async () => {
    dialogRefMock = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [AddPersonDialogComponent],
      providers: [provideNoopAnimations(), { provide: DialogRef, useValue: dialogRefMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPersonDialogComponent);
    component = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect({
      controls: Object.keys(component.form.controls),
      invalid: component.form.invalid,
    }).toMatchSnapshot();
  });

  describe('onCancel()', () => {
    it('should close the dialog without a value', () => {
      component.onCancel();
      expect(dialogRefMock.close).toHaveBeenCalledWith();
    });
  });

  describe('onSubmit()', () => {
    it('should not close the dialog when the form is invalid', () => {
      component.onSubmit();
      expect(dialogRefMock.close).not.toHaveBeenCalled();
    });

    it('should close the dialog with the form value when valid', () => {
      component.form.setValue({
        birth_year: '19BBY',
        gender: 'female',
        height: '150',
        mass: '49',
        name: 'Leia',
      });
      component.onSubmit();
      expect(dialogRefMock.close).toHaveBeenCalledWith({
        birth_year: '19BBY',
        gender: 'female',
        height: '150',
        mass: '49',
        name: 'Leia',
      });
    });
  });
});

import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import type { NewPersonFields } from '../../models/swapi-person.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  selector: 'smp-add-person-dialog',
  standalone: true,
  styleUrls: ['./add-person-dialog.component.scss'],
  templateUrl: './add-person-dialog.component.html',
})
export class AddPersonDialogComponent {
  static readonly genderOptions: readonly string[] = ['female', 'male', 'hermaphrodite', 'n/a'];
  #dialogRef = inject<DialogRef<NewPersonFields>>(DialogRef);
  #fb = inject(FormBuilder);
  form = this.#fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    height: ['', Validators.required],
    mass: ['', Validators.required],
    birth_year: ['', Validators.required],
    gender: ['', Validators.required],
  });
  readonly genderOptions = AddPersonDialogComponent.genderOptions;

  onCancel(): void {
    this.#dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.#dialogRef.close(this.form.getRawValue());
  }
}

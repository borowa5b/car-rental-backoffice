import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RentalsService } from '../rentals.service';
import { Dictionaries } from '../model/dictionaries';
import { MatSnackBar } from '@angular/material/snack-bar';
import { handleErrors } from '../util/form.util';

@Component({
  selector: 'app-add-car-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-car-dialog.component.html',
  styleUrl: './add-car-dialog.component.scss',
})
export class AddCarDialogComponent {
  protected brands?: string[];
  protected formGroup = new FormGroup({
    brandControl: new FormControl('', [Validators.required]),
    modelControl: new FormControl('', [Validators.required]),
    generationControl: new FormControl('', [Validators.required]),
    productionYearControl: new FormControl('', [
      Validators.required,
      Validators.min(1900),
      Validators.max(3000),
    ]),
    paintColorControl: new FormControl('', [Validators.required]),
    pricePerDayControl: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
    quantityControl: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(
    private dialogRef: MatDialogRef<AddCarDialogComponent>,
    private rentalsService: RentalsService,
    private snackBar: MatSnackBar,
  ) {
    this.rentalsService.getDictionaries().subscribe({
      next: (result) => {
        this.brands = result
          .filter((dictionaries) => dictionaries.name === Dictionaries.brand)
          .flatMap((dictionary) => dictionary.values);
      },
    });
  }

  protected onSubmit() {
    if (this.formGroup.valid) {
      this.addCar();
      this.closeDialog();
    } else {
      this.snackBar.open('Form invalid. Please correct errors.');
    }
  }

  private closeDialog() {
    this.dialogRef.close(true);
  }

  private addCar(): void {
    this.rentalsService
      .addCar({
        brand: this.formGroup.controls.brandControl.value!,
        model: this.formGroup.controls.modelControl.value!,
        generation: this.formGroup.controls.generationControl.value!,
        productionYear: Number(
          this.formGroup.controls.productionYearControl.value!,
        ),
        color: this.formGroup.controls.paintColorControl.value!,
        pricePerDay: Number(this.formGroup.controls.pricePerDayControl.value!),
        quantity: Number(this.formGroup.controls.quantityControl.value!),
      })
      .subscribe({
        next: (result) => {
          this.snackBar.open(`Car with id ${result.carId} has beed added`);
          this.closeDialog();
        },
        error: (errorResult) =>
          handleErrors(errorResult, () =>
            this.snackBar.open('Unknown error occurred'),
          ),
      });
  }
}

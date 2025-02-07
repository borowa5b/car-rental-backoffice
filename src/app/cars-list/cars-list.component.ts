import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCarDialogComponent } from '../add-car-dialog/add-car-dialog.component';
import { Car } from '../model/car.model';
import { CarsFilter } from '../model/cars.filter';
import { RentalsService } from '../rentals.service';
import { TableComponent } from '../table/table.component';
import { clearErrors, handleErrors } from '../util/form.util';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    DatePipe,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    TableComponent,
    MatToolbarModule,
  ],
  templateUrl: './cars-list.component.html',
  styleUrl: './cars-list.component.scss',
})
export class CarsListComponent implements OnInit {
  carColumns: string[] = ['position', 'id', 'fullName', 'creationDate'];
  cars!: Car[];
  totalElements!: number;
  filters: CarsFilter = {
    id: null,
    pageNumber: 1,
    pageSize: 10,
  };
  errorMessage?: string | null;

  constructor(
    private rentalsService: RentalsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.filters.pageNumber = params.get('pageNumber')
        ? (params.get('pageNumber') as unknown as number)
        : 1;
      this.getCars();
    });
  }

  protected onNextPage(event?: PageEvent): void {
    this.filters.pageNumber = event ? event.pageIndex + 1 : 1;
    this.router.navigate([], {
      queryParams: {
        pageNumber: this.filters.pageNumber,
      },
    });
  }

  protected filter() {
    clearErrors();
    this.getCars();
  }

  protected addCar() {
    this.dialog
      .open(AddCarDialogComponent)
      .afterClosed()
      .subscribe({
        next: (succeded) => {
          if (succeded) {
            this.getCars();
          }
        },
      });
  }

  private getCars(): void {
    this.rentalsService.getCars(this.filters).subscribe({
      next: (result) => {
        this.cars = result.data;
        this.filters.pageNumber = result.pagination.number;
        this.filters.pageSize = result.pagination.size;
        this.totalElements = result.pagination.hasNext
          ? result.data.length * this.filters.pageNumber + 1
          : result.data.length;
      },
      error: (errorResult) =>
        handleErrors(errorResult, () =>
          this.snackBar.open('Unknown error occurred'),
        ),
    });
  }
}

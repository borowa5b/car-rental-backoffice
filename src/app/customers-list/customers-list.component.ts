import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../model/car.model';
import { CarsFilter } from '../model/cars.filter';
import { RentalsService } from '../rentals.service';
import { TableComponent } from '../table/table.component';
import { clearErrors, handleErrors } from '../util/form.util';
import { Customer } from '../model/customer.model';
import { CustomersFilter } from '../model/customers.filter';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    CommonModule,
    DatePipe,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    TableComponent,
  ],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
})
export class CustomersListComponent implements OnInit {
  customersColumns: string[] = ['position', 'id', 'fullName', 'creationDate'];
  customers!: Customer[];
  totalElements!: number;
  filters: CustomersFilter = {
    id: null,
    pageNumber: 1,
    pageSize: 10,
  };
  errorMessage?: string | null;

  constructor(
    private rentalsService: RentalsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.filters.pageNumber = params.get('pageNumber')
        ? (params.get('pageNumber') as unknown as number)
        : 1;
      this.getCustomers();
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
    this.getCustomers();
  }

  private getCustomers(): void {
    this.rentalsService.getCustomers(this.filters).subscribe({
      next: (result) => {
        this.customers = result.data;
        this.filters.pageNumber = result.pagination.number;
        this.filters.pageSize = result.pagination.size;
        this.totalElements = result.pagination.hasNext
          ? result.data.length * this.filters.pageNumber + 1
          : result.data.length;
      },
      error: (errorResult) =>
        handleErrors(errorResult, () =>
          this.snackBar.open('Unknown error occurred')
        ),
    });
  }
}

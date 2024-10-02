import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Rental } from '../model/rental.model';
import { RentalsFilter } from '../model/rentals.filter';
import { RentalsService } from './../rentals.service';

@Component({
  selector: 'app-rentals-list',
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
  ],
  templateUrl: './rentals-list.component.html',
  styleUrl: './rentals-list.component.scss',
})
export class RentalsListComponent implements OnInit {
  rentalColumns: string[] = ['position', 'id', 'status', 'creationDate'];
  rentals!: Rental[];
  totalElements!: number;
  filters: RentalsFilter = {
    id: null,
    pageNumber: 1,
    pageSize: 10,
  };
  errorMessage?: string | null;

  constructor(
    private rentalsService: RentalsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.filters.pageNumber = params.get('pageNumber')
        ? (params.get('pageNumber') as unknown as number)
        : 1;
      this.getRentals();
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
    this.getRentals();
  }

  protected resolveIndex(index: number): number {
    if (this.filters.pageNumber === 1) return index + 1;
    return index + (this.filters.pageNumber - 1) * this.filters.pageSize + 1;
  }

  private getRentals(): void {
    this.rentalsService.getRentals(this.filters).subscribe(
      (result) => {
        this.errorMessage = null;
        this.rentals = result.data;
        this.filters.pageNumber = result.pagination.number;
        this.filters.pageSize = result.pagination.size;
        this.totalElements = result.pagination.hasNext
          ? result.data.length * this.filters.pageNumber + 1
          : result.data.length;
      },
      (error) => {
        this.errorMessage = error.error.errors[0].message;
        console.log(this.errorMessage);
      }
    );
  }
}

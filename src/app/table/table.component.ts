import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  input,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { Filter } from '../model/filter';
import { RentalsService } from '../rentals.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> implements AfterContentInit {
  totalElements!: number;
  filters: Filter = {
    id: null,
    pageNumber: 1,
    pageSize: 10,
  };

  @ContentChildren(MatHeaderRowDef)
  headerRowDefs!: QueryList<MatHeaderRowDef>;

  @ContentChildren(MatRowDef)
  rowDefs!: QueryList<MatRowDef<T>>;

  @ContentChildren(MatColumnDef)
  columnDefs!: QueryList<MatColumnDef>;

  @ContentChild(MatNoDataRow)
  noDataRow!: MatNoDataRow;

  @ViewChild(MatTable, { static: true })
  table!: MatTable<T>;

  readonly columns = input.required<string[]>();
  readonly dataSource = input.required<T[]>();

  constructor(
    private rentalsService: RentalsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngAfterContentInit(): void {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach((rowDef) => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach((headerRowDef) =>
      this.table.addHeaderRowDef(headerRowDef),
    );
    this.table.setNoDataRow(this.noDataRow);
  }

  protected resolveIndex(index: number): number {
    if (this.filters.pageNumber === 1) return index + 1;
    return index + (this.filters.pageNumber - 1) * this.filters.pageSize + 1;
  }

  protected onNextPage(event?: PageEvent): void {
    this.filters.pageNumber = event ? event.pageIndex + 1 : 1;
    this.router.navigate([], {
      queryParams: {
        pageNumber: this.filters.pageNumber,
      },
    });
  }
}

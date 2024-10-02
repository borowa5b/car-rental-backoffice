import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from './model/rental.model';
import { Observable } from 'rxjs';
import { Page } from './model/page.model';
import { RentalsFilter } from './model/rentals.filter';
import { toHttpParams } from './util/request.util';

@Injectable({
  providedIn: 'root',
})
export class RentalsService {
  constructor(private httpClient: HttpClient) {}

  getRentals(filter: RentalsFilter): Observable<Page<Rental>> {
    const httpParams = toHttpParams(filter);
    return this.httpClient.get<Page<Rental>>('http://localhost:8080/rentals', {
      params: httpParams,
    });
  }
}

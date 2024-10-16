import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from './model/rental.model';
import { Observable } from 'rxjs';
import { Page } from './model/page.model';
import { RentalsFilter } from './model/rentals.filter';
import { toHttpParams } from './util/request.util';
import { CarsFilter } from './model/cars.filter';
import { Car } from './model/car.model';

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

  getCars(filter: CarsFilter): Observable<Page<Car>> {
    const httpParams = toHttpParams(filter);
    return this.httpClient.get<Page<Car>>('http://localhost:8080/cars', {
      params: httpParams,
    });
  }
}

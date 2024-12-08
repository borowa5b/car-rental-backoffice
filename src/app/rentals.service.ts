import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, share, timer } from 'rxjs';
import { Car } from './model/car.model';
import { CarsFilter } from './model/cars.filter';
import { Customer } from './model/customer.model';
import { CustomersFilter } from './model/customers.filter';
import { Dictionary } from './model/dictionary.model';
import { Page } from './model/page.model';
import { Rental } from './model/rental.model';
import { RentalsFilter } from './model/rentals.filter';
import { toHttpParams } from './util/request.util';
import { AddCarRequest } from './request/add-car.request';
import { AddCarResponse } from './response/add-car.response';

@Injectable({
  providedIn: 'root',
})
export class RentalsService {
  private readonly CACHE_TIMEOUT = 1000 * 60 * 60;
  private dictionaries$?: Observable<Dictionary[]>;

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

  addCar(request: AddCarRequest): Observable<AddCarResponse> {
    return this.httpClient.put<AddCarResponse>('http://localhost:8080/cars', request)
  }

  getCustomers(filter: CustomersFilter): Observable<Page<Customer>> {
    const httpParams = toHttpParams(filter);
    return this.httpClient.get<Page<Customer>>(
      'http://localhost:8080/customers',
      {
        params: httpParams,
      }
    );
  }

  getDictionaries(): Observable<Dictionary[]> {
    if (!this.dictionaries$) {
      this.dictionaries$ = this.httpClient
        .get<Dictionary[]>('http://localhost:8080/dictionaries')
        .pipe(
          share({
            connector: () => new ReplaySubject(1),
            resetOnComplete: () => timer(this.CACHE_TIMEOUT),
          })
        );
    }
    return this.dictionaries$;
  }
}

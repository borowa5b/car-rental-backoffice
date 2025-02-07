import { Routes } from '@angular/router';
import { RentalsListComponent } from './rentals-list/rentals-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarsListComponent } from './cars-list/cars-list.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'rentals',
    component: RentalsListComponent,
  },
  {
    path: 'cars',
    component: CarsListComponent,
  },
  {
    path: 'customers',
    component: CustomersListComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
];

export interface Rental {
  id: string;
  carId: string;
  customerId: string;
  status: string;
  price: number;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
}

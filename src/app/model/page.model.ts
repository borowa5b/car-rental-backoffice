import { Pagination } from "./pagination.model";

export interface Page<T> {
  data: T[];
  pagination: Pagination
}

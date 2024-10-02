import { HttpParams } from '@angular/common/http';

export function toHttpParams(object: any): HttpParams {
  let httpParams = new HttpParams();
  Object.keys(object).forEach(
    key => object[key] && (httpParams = httpParams.append(key, object[key]))
);
  return httpParams;
}

import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export function authorizationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const nextRequest = request.clone({
    headers: request.headers
      .set('Authorization', environment.carRentalApiKey)
      .set('Role', 'ROLE_ADMIN'),
  });
  return next(nextRequest);
}

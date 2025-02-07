import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { KeycloakService } from '../../keycloak.service';

export function authorizationInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const keycloakService = inject(KeycloakService);
  const bearer = keycloakService.profile()?.token;

  const nextRequest = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${bearer}`),
  });
  return next(nextRequest);
}

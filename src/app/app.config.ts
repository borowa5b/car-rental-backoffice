import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authorizationInterceptor } from './infrastructure/interceptor/authorization.interceptor';
import { guardInterceptor } from './infrastructure/interceptor/guard.interceptor';
import { KeycloakService } from './keycloak.service';

export const appConfig: ApplicationConfig = {
  providers: [
    KeycloakService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authorizationInterceptor, guardInterceptor]),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeKeycloak(inject(KeycloakService)),
      multi: true,
    },
  ],
};

function initializeKeycloak(
  keycloakService: KeycloakService,
): () => Promise<boolean> {
  return () => keycloakService.init();
}

import { inject, PLATFORM_ID, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { isPlatformServer } from '@angular/common';
import { environment } from '../environments/environment';

export interface UserProfile {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  token: string;
}

export class KeycloakService {
  private readonly platformId: Object = inject(PLATFORM_ID);
  private readonly refreshTokenTimeInSeconds = 30;
  private keycloak: Keycloak;
  profile = signal<UserProfile | undefined>(undefined);

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloakUrl,
      realm: environment.keycloakRealm,
      clientId: environment.keycloakClientId,
    });
  }

  async init(): Promise<boolean> {
    // Prevent auth from server side
    if (isPlatformServer(this.platformId)) {
      return false;
    }

    // Browser auth flow
    return new Promise((resolve, reject) => {
      this.keycloak
        .init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
        })
        .then((authenticated) => {
          if (authenticated) {
            this.profile.set(
              this.keycloak.loadUserInfo() as unknown as UserProfile,
            );
            this.updateProfileToken();
            // set token update
            this.updateToken();
          }
          resolve(authenticated);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  login() {
    return this.keycloak.login();
  }

  logout() {
    return this.keycloak.logout({
      redirectUri: `${location.protocol}//${location.host}`,
    });
  }

  private updateToken(): void {
    setInterval(() => {
      this.keycloak.updateToken(this.refreshTokenTimeInSeconds).then(
        (refreshed) => {
          if (refreshed) {
            this.updateProfileToken();
          }
        },
        () => {
          console.error('Failed to refresh token');
        },
      );
    }, this.refreshTokenTimeInSeconds * 1000);
  }

  private updateProfileToken(): void {
    this.profile.update((profile) => {
      if (profile) {
        profile.token = this.keycloak.token || '';
        return profile;
      }
      return profile;
    });
  }
}

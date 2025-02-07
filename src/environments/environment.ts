export const environment = {
  production: true,
  carRentalUrl: '#{CAR_RENTAL_URL}',

  // Keycloak configuration
  keycloakUrl: `#{KEYCLOAK_URL}`,
  keycloakRealm: 'master',
  keycloakClientId: 'car-rental',
};

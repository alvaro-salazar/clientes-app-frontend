import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // URL base del realm de Keycloak.
  // La librería descarga la configuración OIDC desde:
  // {issuer}/.well-known/openid-configuration
  issuer: 'http://localhost:8090/realms/curso-springboot',

  // Adónde redirige Keycloak después del login.
  // Debe coincidir con uno de los redirectUris del client en Keycloak.
  redirectUri: window.location.origin,

  // El client Angular creado en Keycloak (sin secret — es publicClient)
  clientId: 'angular-client',

  // 'code' activa el flujo Authorization Code (PKCE automático)
  responseType: 'code',

  // openid: requerido para OIDC (emite id_token con info del usuario)
  // profile: incluye preferred_username, given_name, family_name
  // email: incluye el email del usuario
  scope: 'openid profile email',

  // Solo para desarrollo — en producción siempre true
  requireHttps: false,

  // Muestra en la consola del navegador cada paso del flujo OAuth2
  showDebugInformation: true,
};

import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure(): void {
    this.oauthService.configure(authConfig);

    // loadDiscoveryDocumentAndTryLogin hace dos cosas:
    // 1. Descarga la configuración OIDC de Keycloak
    //    ({issuer}/.well-known/openid-configuration)
    // 2. Si la URL tiene ?code=...&state=... (venimos del redirect de Keycloak),
    //    intercambia automáticamente ese código por un access_token
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  /** Redirige el navegador a la página de login de Keycloak */
  login(): void {
    this.oauthService.initCodeFlow();
  }

  /** Cierra sesión local y en Keycloak */
  logout(): void {
    const idToken = this.oauthService.getIdToken();
    this.oauthService.logOut({ id_token_hint: idToken });
  }

  /** true si hay un access_token válido y no expirado */
  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /** Nombre de usuario desde el claim preferred_username del id_token */
  getUsername(): string | null {
    const claims = this.oauthService.getIdentityClaims() as Record<string, unknown>;
    return (claims?.['preferred_username'] as string) ?? null;
  }

  /** El access_token JWT — lo usa el interceptor para las peticiones HTTP */
  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  /** Lista de roles desde realm_access.roles del access_token.
   *  Keycloak no incluye realm_access en el id_token por defecto,
   *  por eso decodificamos el access_token (JWT) directamente. */
  getRoles(): string[] {
    const token = this.oauthService.getAccessToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const realmAccess = payload?.['realm_access'] as Record<string, unknown>;
      return (realmAccess?.['roles'] as string[]) ?? [];
    } catch {
      return [];
    }
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ADMIN');
  }

  /** URL de la foto de perfil desde el claim foto_url del id_token.
   *  Devuelve null si el usuario no tiene foto asignada todavía. */
  getFotoUrl(): string | null {
    const claims = this.oauthService.getIdentityClaims() as Record<string, unknown>;
    return (claims?.['foto_url'] as string) ?? null;
  }
}

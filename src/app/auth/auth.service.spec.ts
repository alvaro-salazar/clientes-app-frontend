import { TestBed } from '@angular/core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let oauthSpy: jasmine.SpyObj<OAuthService>;

  beforeEach(() => {
    // Creamos un spy (doble de prueba) de OAuthService.
    // jasmine.createSpyObj reemplaza todos los métodos por funciones que
    // podemos controlar — sin hacer llamadas reales a Keycloak.
    oauthSpy = jasmine.createSpyObj('OAuthService', [
      'configure',
      'loadDiscoveryDocumentAndTryLogin',
      'initCodeFlow',
      'logOut',
      'hasValidAccessToken',
      'getAccessToken',
      'getIdentityClaims'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // Sustituimos OAuthService real por el spy
        { provide: OAuthService, useValue: oauthSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('al crearse configura y ejecuta loadDiscoveryDocumentAndTryLogin', () => {
    expect(oauthSpy.configure).toHaveBeenCalled();
    expect(oauthSpy.loadDiscoveryDocumentAndTryLogin).toHaveBeenCalled();
  });

  it('isAuthenticated() delega en hasValidAccessToken()', () => {
    oauthSpy.hasValidAccessToken.and.returnValue(true);
    expect(service.isAuthenticated()).toBeTrue();

    oauthSpy.hasValidAccessToken.and.returnValue(false);
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('login() llama a initCodeFlow()', () => {
    service.login();
    expect(oauthSpy.initCodeFlow).toHaveBeenCalledTimes(1);
  });

  it('logout() llama a logOut()', () => {
    service.logout();
    expect(oauthSpy.logOut).toHaveBeenCalledTimes(1);
  });

  it('getUsername() extrae preferred_username de los claims', () => {
    oauthSpy.getIdentityClaims.and.returnValue({ preferred_username: 'alice' });
    expect(service.getUsername()).toBe('alice');
  });

  it('getUsername() devuelve null si no hay claims', () => {
    oauthSpy.getIdentityClaims.and.returnValue({});
    expect(service.getUsername()).toBeNull();
  });

  it('getRoles() extrae roles de realm_access', () => {
    oauthSpy.getIdentityClaims.and.returnValue({
      realm_access: { roles: ['USER', 'offline_access'] }
    });
    expect(service.getRoles()).toContain('USER');
  });

  it('getRoles() devuelve [] si no hay claims', () => {
    oauthSpy.getIdentityClaims.and.returnValue({});
    expect(service.getRoles()).toEqual([]);
  });

  it('isAdmin() devuelve true si tiene rol ADMIN', () => {
    oauthSpy.getIdentityClaims.and.returnValue({
      realm_access: { roles: ['ADMIN'] }
    });
    expect(service.isAdmin()).toBeTrue();
  });

  it('isAdmin() devuelve false para rol USER', () => {
    oauthSpy.getIdentityClaims.and.returnValue({
      realm_access: { roles: ['USER'] }
    });
    expect(service.isAdmin()).toBeFalse();
  });
});

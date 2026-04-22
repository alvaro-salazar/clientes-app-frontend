import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated() devuelve false cuando no hay sesión', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('login() con credenciales válidas guarda el usuario y devuelve true', () => {
    const resultado = service.login('admin', '1234');
    expect(resultado).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getUsername()).toBe('admin');
  });

  it('login() con contraseña vacía devuelve false y no guarda sesión', () => {
    const resultado = service.login('admin', '');
    expect(resultado).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('login() con usuario vacío devuelve false', () => {
    const resultado = service.login('', '1234');
    expect(resultado).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('logout() elimina la sesión activa', () => {
    service.login('admin', '1234');
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getUsername()).toBeNull();
  });

  it('getUsername() devuelve null cuando no hay sesión', () => {
    expect(service.getUsername()).toBeNull();
  });
});

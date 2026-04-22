import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly KEY_USER = 'auth_user';

  login(username: string, password: string): boolean {
    // Mock: cualquier usuario con contraseña no vacía puede ingresar
    if (username && password) {
      localStorage.setItem(this.KEY_USER, username);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.KEY_USER);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.KEY_USER);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.KEY_USER);
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(public authService: AuthService) {}

  logout(): void {
    // logOut() de OAuthService cierra la sesión local y redirige a Keycloak
    // para cerrar también la sesión allí (Single Logout).
    this.authService.logout();
  }
}

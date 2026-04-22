import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Si el usuario llega a /auth/login y ya está autenticado (volvió del redirect),
    // no hace falta hacer nada — el guard ya lo enviará a la ruta protegida.
    // Si no está autenticado, redirige directamente a Keycloak.
    if (!this.authService.isAuthenticated()) {
      this.authService.login();
    }
  }
}

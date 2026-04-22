import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    const ok = this.authService.login(this.username, this.password);
    if (ok) {
      this.router.navigate(['/clientes']);
    } else {
      this.error = 'Usuario y contraseña son obligatorios.';
    }
  }
}

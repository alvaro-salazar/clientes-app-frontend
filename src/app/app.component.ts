import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  mostrarNavbar = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.mostrarNavbar = !e.urlAfterRedirects.startsWith('/auth');
      });
  }
}

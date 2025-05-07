import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdoptadorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si localStorage está disponible
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.role === 'adoptador') {
        return true;
      }
    }

    // Redirigir a una página de acceso denegado o al inicio si no es adoptador
    this.router.navigate(['/']);
    return false;
  }
}

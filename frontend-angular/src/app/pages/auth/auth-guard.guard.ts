import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si localStorage está disponible
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      return true; // El usuario está autenticado
    } else {
      this.router.navigate(['/auth/login']); // Redirigir al login si no hay token
      return false;
    }
  }
}

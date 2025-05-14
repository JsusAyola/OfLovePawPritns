import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router'; // Importar Router
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './pages/auth/auth.service';
import Swal from 'sweetalert2'; // Importar SweetAlert2

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pawprint';
  userName: string | null = null;
  userRole: string | null = null;
  // userId: string | null = null; // Se elimina porque no se usa en el código proporcionado

  // isModalOpen: boolean = false; // Se elimina porque ya no se usa para el modal de "Predicción?"

  constructor(
    private authService: AuthService,
    private router: Router // Inyectar el Router para navegación programática
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        // Asume que user.name ya contiene el nombre completo (ej. "Nombre Apellido")
        this.userName = user.name;
        this.userRole = user.role;
        // Si user.name es undefined, podrías usar:
        // this.userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name;
      } else {
        this.userName = null; // Asegurar que userName sea null si el usuario no está logueado
        this.userRole = null;
      }
    });

    // Este bloque verifica el estado de inicio de sesión inicial del localStorage.
    // Es buena práctica que tu AuthService maneje esto internamente en su constructor o un método init.
    // Sin embargo, si tu AuthService aún no lo hace, este bloque sirve para sincronizar el estado.
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    if (isBrowser) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.firstName && user.lastName && user.role) {
        // Si el usuario no está seteado por la suscripción o es diferente, llama a login.
        // Ten cuidado con esto, si AuthService ya maneja el estado inicial, esto podría ser redundante
        // o causar un loop si AuthService.login() vuelve a emitir en user$.
        if (!this.userName || this.userName !== `${user.firstName} ${user.lastName}`) {
             this.authService.login(`${user.firstName} ${user.lastName}`, user.role);
        }
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.logout();
    this.router.navigate(['/']); // Usar router.navigate para una navegación más limpia
  }

  /**
   * Maneja el clic en "History Prediction".
   * Verifica si el usuario está logueado y decide si navegar o mostrar SweetAlert.
   */
  checkLoginAndNavigateToHistory(): void {
    if (this.userName) { // Si userName tiene un valor, el usuario está logueado
      this.router.navigate(['/prediction-history']); // Navega a la ruta del historial
    } else {
      // Si el usuario NO está logueado, muestra la alerta de SweetAlert
      Swal.fire({
        title: 'Acceso Restringido',
        text: 'Para ver el historial de predicciones, necesitas iniciar sesión.',
        icon: 'warning', // Puedes usar 'info', 'error', 'success', 'question'
        showCancelButton: true,
        confirmButtonText: 'Ir a Iniciar Sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33', // Color rojo para el botón de confirmar (Ir a Iniciar Sesión)
        cancelButtonColor: '#3085d6' // Color azul para el botón de cancelar
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario hace clic en "Ir a Iniciar Sesión", redirige a la página de login
          this.router.navigate(['/auth/login']);
        }
      });
    }
  }

  // Se eliminan los métodos y propiedades relacionados con el modal antiguo:
  // openModal(): void {
  //   this.isModalOpen = true;
  // }
  // closeModal(): void {
  //   this.isModalOpen = false;
  // }
}
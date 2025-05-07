import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reset-password',
    imports: [FormsModule, CommonModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = ''; // Variable para almacenar el correo electrónico
  isEmailSent: boolean = false; // Para controlar si el correo ha sido enviado

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.email) {
      // Hacer la solicitud HTTP al backend para enviar el enlace de restablecimiento
      this.http.post('http://localhost:5000/api/auth/reset-password', { email: this.email }).subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: `Se ha enviado el enlace de recuperación a: ${this.email}. Por favor revisa tu correo.`,
            confirmButtonText: 'Aceptar',
          });
          // Una vez enviado, redirigimos a la página de confirmación
          this.router.navigate(['/auth/reset-password-confirmation']);
        },
        (error) => {
          console.error('Error al enviar el enlace de recuperación:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar el enlace',
            text: 'Hubo un error al enviar el enlace. Por favor, intenta de nuevo.',
            confirmButtonText: 'Aceptar',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  // Método para navegar a la página de inicio de sesión
  navigateToLogin() {
    this.router.navigate(['/auth/iniciar-sesion']);
  }
}

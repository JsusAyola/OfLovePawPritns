import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    imports: [FormsModule, HttpClientModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const loginData = {
        email: this.email.trim(),
        password: this.password.trim(),
      };

      // Asegúrate de que los datos sean enviados como JSON
      this.http.post('http://localhost:5000/api/auth/login', loginData, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      }).subscribe(
        (response: any) => {
          console.log('Respuesta completa del backend:', JSON.stringify(response, null, 2));

          // Asegúrate de que el backend responde con el token
          if (response.token) {
            console.log('Login exitoso, token recibido:', response.token);

            // Guardar el token en localStorage
            localStorage.setItem('token', response.token);

            // Guardar el objeto user completo en localStorage
            const user = {
              id: response.userId,
              firstName: response.firstName,
              lastName: response.lastName,
              email: response.email,
              role: response.role,
            };

            localStorage.setItem('user', JSON.stringify(user));

            // Actualizar el servicio de autenticación con el nombre y rol del usuario logueado
            this.authService.login(`${user.firstName} ${user.lastName}`, user.role);

            // Mostrar alerta de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Login exitoso!',
              text: 'Redirigiendo a Mi Cuenta...',
              timer: 4000,
              showConfirmButton: false,
            });

            // Redirigir al dashboard
            this.router.navigate(['/dashboard/mi-cuenta']);
          } else {
            console.error('No se recibió un token en la respuesta');
            Swal.fire({
              icon: 'error',
              title: 'Error de autenticación',
              text: 'No se recibió un token en la respuesta.',
            });
          }
        },
        (error) => {
          console.error('Error en el login:', error);
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Intenta de nuevo.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos correctamente.',
      });
    }
  }

  // Método para redirigir a la página de registro
  navigateToRegister() {
    this.router.navigate(['/auth/information']);
  }

  // Método para redirigir a la página de restablecer contraseña
  navigateToResetPassword() {
    this.router.navigate(['/auth/reset-password']);
  }

  // Método para acceder al dashboard (ruta protegida)
  goToDashboard() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get('http://localhost:5000/api/dashboard', { headers }).subscribe(
        (response: any) => {
          console.log('Acceso al dashboard:', response);
        },
        (error) => {
          console.error('Error al acceder al dashboard:', error);
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes acceso al dashboard.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No autenticado',
        text: 'Por favor, inicia sesión primero.',
      });
      this.router.navigate(['/auth/login']);
    }
  }
}

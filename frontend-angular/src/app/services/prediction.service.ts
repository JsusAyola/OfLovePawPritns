import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';  // Importamos SweetAlert2
import { Router } from '@angular/router';  // Importamos el Router de Angular

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/api/pett/predic'; // Ajustado al nuevo endpoint

  constructor(private http: HttpClient, private router: Router) { }  // Inyectamos el Router de Angular

  // Método para enviar datos al backend y recibir la predicción
  predict(data: any): Observable<any> {
    const token = localStorage.getItem('token');  // Obtener el token JWT almacenado en localStorage
    if (!token) {
      // Mostrar un SweetAlert2 si el usuario no está logueado
      Swal.fire({
        icon: 'error',
        title: 'No puedes hacer la predicción',
        text: 'Debes estar logueado para hacer una predicción.',
        confirmButtonText: 'Iniciar sesión',
      }).then(() => {
        // Redirigir a la página de login usando el Router de Angular
        this.router.navigate(['/auth/login']);  // Usamos el router de Angular para redirigir
      });
      return throwError(() => new Error('Token no encontrado.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Incluir el token en los headers

    return this.http.post<any>(this.apiUrl, data, { headers }).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente (ej: red, CORS)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código ${error.status}: ${error.error?.message || error.message}`;
    }
    console.error(errorMessage);

    // Mostrar SweetAlert2 si el error es 401 (Unauthorized)
    if (error.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Token inválido o expirado',
        text: 'Por favor, inicia sesión nuevamente.',
        confirmButtonText: 'Iniciar sesión',
      }).then(() => {
        // Redirigir a la página de login usando el Router de Angular
        this.router.navigate(['/auth/login']);  // Usamos el router de Angular para redirigir
      });
    }

    return throwError(() => new Error(errorMessage));
  }
}

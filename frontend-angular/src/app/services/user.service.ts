import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/admin'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para verificar si estamos en un entorno de navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  // Obtener el token de localStorage y agregar a los encabezados
  private getAuthHeaders(): HttpHeaders {
    if (!this.isBrowser()) {
      throw new Error('localStorage no está disponible en este entorno');
    }

    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Obtener todos los usuarios
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users`, { headers }).pipe(
      catchError(err => {
        console.error('Error al obtener los usuarios:', err);
        return throwError(err);
      })
    );
  }

  // Eliminar un usuario por su ID
  deleteUser(userId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
      catchError(err => {
        console.error('Error al eliminar el usuario:', err);
        return throwError(err);
      })
    );
  }
}

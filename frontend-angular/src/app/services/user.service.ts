import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // Obtener todos los usuarios
  getAllUsers(): Observable<any> {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Añadir el token a los encabezados
        return this.http.get(`${this.apiUrl}/users`, { headers });
      } else {
        throw new Error('No hay token de autenticación');
      }
    } else {
      throw new Error('localStorage no está disponible en este entorno');
    }
  }

  // Eliminar un usuario por su ID
  deleteUser(userId: string): Observable<any> {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Añadir el token a los encabezados
        return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers });
      } else {
        throw new Error('No hay token de autenticación');
      }
    } else {
      throw new Error('localStorage no está disponible en este entorno');
    }
  }
}

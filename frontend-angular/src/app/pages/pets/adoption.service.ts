import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdoptionService {
  private apiUrl = 'http://localhost:5000/api/solicitudes';

  constructor(private http: HttpClient) {}

  // Método para verificar el formulario de adopción
  checkAdoptionForm(adoptadorId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-adoption-form/${adoptadorId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener solicitudes de adopción filtradas por tipo de mascota (gato o perro)
  getSolicitudesByTipo(tipoMascota: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipo/${tipoMascota}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar solicitudes de adopción (aprobar o rechazar)
  handleAdoptionRequest(action: string, solicitudId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/aprobar/${solicitudId}`, { action }, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Función para crear los headers de autorización
  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Función para manejar errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    throw new Error('Error en la solicitud. Por favor, inténtalo de nuevo más tarde.');
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root' // Esto permite que el servicio sea singleton y accesible en toda la app
})
export class PredictionService {
  private apiUrl = 'http://localhost:5000/api/pett/predic'; // Ajustado al nuevo endpoint

  constructor(private http: HttpClient) { }

  // Método para enviar datos al backend y recibir la predicción
  predict(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
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
    return throwError(() => new Error(errorMessage));
  }
}

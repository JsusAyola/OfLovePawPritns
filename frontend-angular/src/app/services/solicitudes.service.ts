import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private baseUrl = 'http://localhost:5000/api/solicitudes';

  constructor(private http: HttpClient) {}

  // Crear una solicitud de adopción
  createSolicitud(solicitudData: { mascota_id: string; adoptador_id: string; cuidador_id: string }): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.baseUrl}/create`, solicitudData, { headers });
  }


  // Obtener todas las solicitudes para un cuidador
  getSolicitudesCuidador(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cuidador`, { headers: this.createAuthorizationHeader() });
  }

  // Obtener todas las solicitudes de un adoptador
  getSolicitudesAdoptador(): Observable<any> {
    return this.http.get(`${this.baseUrl}/historial`, { headers: this.createAuthorizationHeader() });
  }

  // Obtener detalles de una solicitud específica
  getSolicitudesByTipo(tipoMascota: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tipo/${tipoMascota}`, { headers: this.createAuthorizationHeader() });
  }
  

// Añade estos métodos si no los tienes
aprobarSolicitud(solicitudId: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/aprobar/${solicitudId}`, {}, { 
    headers: this.createAuthorizationHeader() 
  });
}

rechazarSolicitud(solicitudId: string, motivo: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/rechazar/${solicitudId}`, { motivo }, { 
    headers: this.createAuthorizationHeader() 
  });
}
  

  // Obtener el formulario de adopción de un adoptador
  getFormularioAdoptador(adoptadorId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/formulario/${adoptadorId}`, { headers: this.createAuthorizationHeader() });
  }

  // Actualizar el formulario de adopción de un adoptador
  actualizarFormularioAdoptador(adoptadorId: string, formularioData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizar-formulario/${adoptadorId}`, formularioData, { headers: this.createAuthorizationHeader() });
  }

  // Obtener mascotas adoptadas
  getMascotasAdoptadas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/adoptadas`, { headers: this.createAuthorizationHeader() });
  }

  // Método privado para crear el encabezado de autorización
  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private apiUrl = 'http://localhost:5000/api/pets';

  constructor(private http: HttpClient) {}

  // Método para obtener todas las mascotas
  getPets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  incrementInterestedCount(petId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${petId}/increment-interest`, {});
  }

  // Método para obtener una mascota específica por ID
  getPetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para agregar una nueva mascota con imagen
  addPet(petData: any, image: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('name', petData.name);
    formData.append('birthDate', petData.birthDate);
    formData.append('breed', petData.breed);
    formData.append('status', petData.status);
    formData.append('vaccines', JSON.stringify(petData.vaccines)); // Convertir el array a string
    formData.append('type', petData.type);
    formData.append('sex', petData.sex);
    formData.append('size', petData.size);
    formData.append('weight', petData.weight.toString());

    if (image) {
      formData.append('image', image, image.name);
    }

    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  // Método para obtener las mascotas pendientes (solo para admin)
  getPendingPets(): Observable<any[]> {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/pendientes`, { headers });
  }

  // Método para aprobar o rechazar una mascota
  handlePetApproval(action: string, petId: string): Observable<any> {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = action === 'aprobar' ? `${this.apiUrl}/aprobar/${petId}` : `${this.apiUrl}/rechazar/${petId}`;
    return this.http.put(url, {}, { headers });
  }

  // Método para obtener mascotas por cuidador
  getPetsByCuidador(): Observable<any[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<any[]>(`${this.apiUrl}/cuidador`, { headers });
  }

  // Método para obtener mascotas filtradas por tipo (gato o perro)
  getPetsByType(type: string): Observable<any[]> {
    return this.getPets().pipe(
      map((pets) => pets.filter((pet) => pet.type.toLowerCase() === type.toLowerCase()))
    );
  }

  // Método para actualizar una mascota
  updatePet(id: string, petData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put(`${this.apiUrl}/update/${id}`, petData, { headers });
  }

  // Método para eliminar una mascota
  deletePet(id: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers });
  }

  // Función para crear los headers de autorización
  private createAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Función para verificar el formulario de adopción
  checkAdoptionForm(adoptadorId: string): Observable<boolean> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<boolean>(`http://localhost:5000/api/solicitudes/check-adoption-form/${adoptadorId}`, { headers });
  }

  // Método para obtener solicitudes de adopción filtradas por tipo de mascota (gato o perro)
  getSolicitudesByTipo(tipoMascota: string): Observable<any[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<any[]>(`http://localhost:5000/api/solicitudes/tipo/${tipoMascota}`, { headers });
  }

  // Método para manejar solicitudes de adopción (aprobar o rechazar)
  handleAdoptionRequest(action: string, solicitudId: string): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.put<any>(`http://localhost:5000/api/solicitudes/aprobar/${solicitudId}`, { action }, { headers });
  }

  // Método para obtener mascotas aprobadas y disponibles
  getAvailableApprovedPets(type?: string): Observable<any[]> {
  const params = type ? { params: { type } } : {};
  return this.http.get<any[]>(`${this.apiUrl}/disponibles`, params);
}
}
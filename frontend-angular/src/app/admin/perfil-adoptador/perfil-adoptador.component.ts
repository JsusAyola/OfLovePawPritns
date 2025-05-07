import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-perfil-adoptador',
    templateUrl: './perfil-adoptador.component.html',
    styleUrls: ['./perfil-adoptador.component.css'],
    imports: [CommonModule]
})
export class PerfilAdoptadorComponent implements OnInit {
  adoptador: any = null;
  edad: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const adoptadorId = this.route.snapshot.paramMap.get('id');
    if (adoptadorId) {
      this.cargarAdoptador(adoptadorId);
    }
  }

  // Cargar datos del adoptador y calcular la edad
  cargarAdoptador(id: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:5000/api/users/${id}`, { headers }).subscribe(
      (response: any) => {
        this.adoptador = response;
        this.calcularEdad(response.birthDate);
      },
      (error) => {
        console.error('Error al cargar la información del adoptador:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar la información del adoptador.',
        });
      }
    );
  }

  calcularEdad(birthDate: string) {
    if (birthDate) {
      const nacimiento = new Date(birthDate);
      const diferencia = Date.now() - nacimiento.getTime();
      const edad = new Date(diferencia).getUTCFullYear() - 1970;
      this.edad = edad;
    }
  }

  // Volver al panel del cuidador
  volverAlPanel() {
    this.router.navigate(['/dashboard/cuidador-panel']);
  }
}

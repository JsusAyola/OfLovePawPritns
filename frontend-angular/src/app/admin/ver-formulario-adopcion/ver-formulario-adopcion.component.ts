import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SolicitudesService } from '../../services/solicitudes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common'; // Aquí debes importar Location

@Component({
  selector: 'app-ver-formulario-adopcion',
  imports: [CommonModule , FormsModule],
  templateUrl: './ver-formulario-adopcion.component.html',
  styleUrls: ['./ver-formulario-adopcion.component.css']
})
export class VerFormularioAdopcionComponent implements OnInit {
  formulario: any = {};  // Formulario de adopción
  loading: boolean = true;
  adoptadorId: string = '';
  solicitudId: string = '';

  // Campos del formulario
  edad: string = '';
  ocupacion: string = '';
  experiencia: string = '';
  otraMascota: string = '';
  cantidadMascotas: number = 0;
  tipoMascota: string = '';
  ninosEnCasa: string = '';
  tiempoSola: string = '';
  veterinario: string = '';
  visitasSeguimiento: string = '';
  motivo: string = '';
  tiempoDisponible: string = '';
  presupuesto: string = '';
  aceptaTerminos: boolean = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location // Asegúrate de tener `Location` en el constructor
  ) {}
  
  cancelar(): void {
    // Esto hará que se navegue hacia la página anterior
    this.location.back(); // Usamos Location para retroceder en la historia
  }

  ngOnInit(): void {
    const adoptadorId = this.route.snapshot.paramMap.get('adoptadorId');
    const solicitudId = this.route.snapshot.paramMap.get('solicitudId');
    if (adoptadorId && solicitudId) {
      this.adoptadorId = adoptadorId;
      this.solicitudId = solicitudId;
      this.obtenerFormularioAdopcion();
    }
  }

  obtenerFormularioAdopcion(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'No tienes permiso para ver el formulario.',
        showConfirmButton: true,
        confirmButtonColor: '#FF6347',
        background: '#f7e8e8',
        backdrop: `rgba(0,0,123,0.4) left top no-repeat`
      });
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.solicitudesService.getFormularioAdoptador(this.adoptadorId).subscribe(
      (formulario: any) => {
        this.formulario = formulario;
        this.cargarFormulario(formulario);
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar el formulario:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el formulario de adopción. Intenta de nuevo.',
        });
        this.router.navigate(['/']);
      }
    );
  }

  cargarFormulario(formulario: any) {
    // Asignamos los valores del formulario para mostrarlos en modo solo lectura
    this.edad = formulario.edad;
    this.ocupacion = formulario.ocupacion;
    this.experiencia = formulario.experiencia;
    this.otraMascota = formulario.otraMascota;
    this.cantidadMascotas = formulario.cantidadMascotas;
    this.tipoMascota = formulario.tipoMascota;
    this.ninosEnCasa = formulario.ninosEnCasa;
    this.tiempoSola = formulario.tiempoSola;
    this.veterinario = formulario.veterinario;
    this.visitasSeguimiento = formulario.visitasSeguimiento;
    this.motivo = formulario.motivo;
    this.tiempoDisponible = formulario.tiempoDisponible;
    this.presupuesto = formulario.presupuesto;
    this.aceptaTerminos = formulario.aceptaTerminos;
  }
}

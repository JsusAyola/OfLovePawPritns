import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../pet.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-solicitudes-adopcion',
  standalone: true,
  templateUrl: './solicitudes-adopcion.component.html',
  styleUrls: ['./solicitudes-adopcion.component.css'],
  imports: [CommonModule]
})
export class SolicitudesAdopcionComponent implements OnInit {
  tipoMascota!: string;
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  filtroEstado: string = 'pendiente';
  loading: boolean = true;

  constructor(
    private petService: PetService,
    private solicitudesService: SolicitudesService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tipoMascota = params['tipoMascota'];
      this.loadSolicitudes();
    });
  }

  loadSolicitudes(): void {
    this.loading = true;
    this.petService.getSolicitudesByTipo(this.tipoMascota).subscribe({
      next: (solicitudes) => {
        this.solicitudes = solicitudes;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar las solicitudes', 'error');
      }
    });
  }
  
  cambiarFiltro(estado: string): void {
    this.filtroEstado = estado;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    // Filtro combinado por tipo y estado
    this.solicitudesFiltradas = this.solicitudes.filter(solicitud => {
      const tipoCoincide = this.tipoMascota ? 
        solicitud.mascota_id?.type?.toLowerCase() === this.tipoMascota.toLowerCase() : true;
      const estadoCoincide = solicitud.estado === this.filtroEstado;
      return tipoCoincide && estadoCoincide;
    });
  }

  verDetallesAdoptador(adoptadorId: string): void {
    if (adoptadorId) {
      this.router.navigate(['/dashboard/perfil-adoptador', adoptadorId]);
    } else {
      Swal.fire('Error', 'ID de adoptador no disponible', 'error');
    }
  }

  verFormulario(solicitudId: string, adoptadorId: string): void {
    this.router.navigate([`/cuidador/ver-formulario-adopcion/${adoptadorId}/${solicitudId}`]);
  }

  aprobarSolicitud(solicitudId: string): void {
    Swal.fire({
      title: '¿Aprobar solicitud?',
      text: '¿Estás seguro de aprobar esta solicitud de adopción?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudesService.aprobarSolicitud(solicitudId).subscribe({
          next: () => {
            Swal.fire('¡Aprobada!', 'La solicitud ha sido aprobada', 'success');
            this.loadSolicitudes();
          },
          error: (error) => {
            console.error('Error al aprobar:', error);
            Swal.fire('Error', 'No se pudo aprobar la solicitud', 'error');
          }
        });
      }
    });
  }
  
  rechazarSolicitud(solicitudId: string): void {
    Swal.fire({
      title: 'Motivo del rechazo',
      input: 'textarea',
      inputLabel: 'Por favor ingresa el motivo del rechazo',
      inputPlaceholder: 'Ej: El adoptante no cumple con los requisitos...',
      inputAttributes: {
        'aria-label': 'Motivo del rechazo'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar rechazo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar un motivo para rechazar';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudesService.rechazarSolicitud(solicitudId, result.value).subscribe({
          next: () => {
            Swal.fire('Rechazada', 'La solicitud ha sido rechazada', 'info');
            this.loadSolicitudes();
          },
          error: (error) => {
            console.error('Error al rechazar:', error);
            Swal.fire('Error', 'No se pudo rechazar la solicitud', 'error');
          }
        });
      }
    });
  }

  irAtras(): void {
    this.location.back();
  }
}
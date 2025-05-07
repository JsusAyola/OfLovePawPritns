import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-historial-solicitudes',
    imports: [CommonModule],
    templateUrl: './historial-solicitudes.component.html',
    styleUrls: ['./historial-solicitudes.component.css']
})
export class HistorialSolicitudesComponent implements OnInit {
  solicitudes: any[] = []; // Lista de solicitudes del adoptador

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
    this.solicitudesService.getSolicitudesAdoptador().subscribe(
      (data) => {
        this.solicitudes = data.map((solicitud: any) => ({
          mascotaTipo: solicitud.mascota_id?.type, // Capturamos el tipo (Perro o Gato)
          mascotaNombre: solicitud.mascota_id?.name,
          mascotaImagen: solicitud.mascota_id ? `http://localhost:5000/${solicitud.mascota_id.image}` : null,
          fechaSolicitud: solicitud.fecha_solicitud,
          estado: solicitud.estado
        }));
      },
      (error) => {
        console.error('Error al obtener el historial de solicitudes:', error);
      }
    );
  }      
}

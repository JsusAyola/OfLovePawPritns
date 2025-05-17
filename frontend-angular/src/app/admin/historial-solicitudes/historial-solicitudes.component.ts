import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial-solicitudes',
  imports: [CommonModule],
  templateUrl: './historial-solicitudes.component.html',
  styleUrls: ['./historial-solicitudes.component.css']
})
export class HistorialSolicitudesComponent implements OnInit {
  solicitudes: any[] = []; // Lista de solicitudes del adoptador

  constructor(private solicitudesService: SolicitudesService,private location: Location) {}

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes(): void {
  this.solicitudesService.getSolicitudesAdoptador().subscribe(
    (data) => {
      console.log('Solicitudes recibidas:', data); // <-- para chequear los datos
      this.solicitudes = data.map((solicitud: any) => ({
        mascotaTipo: solicitud.mascota_id?.type,
        mascotaNombre: solicitud.mascota_id?.name,
        mascotaImagen: solicitud.mascota_id ? `http://localhost:5000/${solicitud.mascota_id.image}` : null,
        fechaSolicitud: solicitud.fecha_solicitud,
        estado: solicitud.estado,
        motivoRechazo: solicitud.motivoRechazo
      }));
    },
    (error) => {
      console.error('Error al obtener el historial de solicitudes:', error);
    }
  );
}

mostrarMotivo(motivo: string) {
  Swal.fire({
    title: 'Motivo del rechazo',
    text: motivo || 'No se proporcionó un motivo.',
    icon: 'info',
    confirmButtonText: 'Cerrar'
  });
}

  volverAtras() {
    this.location.back();
  }

}

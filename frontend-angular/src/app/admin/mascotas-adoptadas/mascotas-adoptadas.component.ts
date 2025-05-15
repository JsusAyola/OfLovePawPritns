import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mascotas-adoptadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mascotas-adoptadas.component.html',
  styleUrls: ['./mascotas-adoptadas.component.css']
})
export class MascotasAdoptadasComponent implements OnInit {
  mascotasAdoptadas: any[] = [];
  errorMessage: string = '';

  constructor(private solicitudesService: SolicitudesService, private location: Location) {}

  ngOnInit(): void {
    this.obtenerMascotasAdoptadas();
  }

formatDate(dateString: string): string {
  if (!dateString) return 'Fecha no disponible';
  const date = new Date(dateString);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}


obtenerMascotasAdoptadas(): void {
  this.solicitudesService.getMascotasAdoptadas().subscribe({
    next: (data) => {
      console.log('Solicitud recibida:', data); // <- Aquí inspecciona el objeto completo
      this.mascotasAdoptadas = data.map((solicitud: any) => ({
        nombre: solicitud.mascota_id?.name || 'Nombre no disponible',
        tipo: solicitud.mascota_id?.type || 'Tipo no disponible',
        imagen: solicitud.mascota_id?.image ? `http://localhost:5000/${solicitud.mascota_id.image}` : 'ruta/a/imagen/default.jpg',
        fechaAdopcion: this.formatDate(solicitud.createdAt || solicitud.fecha_solicitud || solicitud.fechaSolicitud),
        raza: solicitud.mascota_id?.breed || 'Raza no especificada',
        descripcion: solicitud.mascota_id?.description || 'Sin descripción disponible'
      }));
    },
    error: (error) => {
      console.error('Error al obtener las mascotas adoptadas:', error);
      this.errorMessage = 'No se pudo cargar la lista de mascotas adoptadas. Intenta nuevamente.';
    }
  });
}

  volverAtras(): void {
    this.location.back();
  }
}

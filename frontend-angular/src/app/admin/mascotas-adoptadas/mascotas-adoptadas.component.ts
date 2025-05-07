import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { CommonModule } from '@angular/common';

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

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.obtenerMascotasAdoptadas();
  }

  obtenerMascotasAdoptadas(): void {
    this.solicitudesService.getMascotasAdoptadas().subscribe({
      next: (data) => {
        console.log('Mascotas adoptadas recibidas:', data); // <-- Aquí revisa si llega "fecha_decision"
        this.mascotasAdoptadas = data.map((solicitud: any) => ({
          nombre: solicitud.mascota_id?.name || 'Nombre no disponible',
          tipo: solicitud.mascota_id?.type || 'Tipo no disponible',
          imagen: solicitud.mascota_id?.image ? `http://localhost:5000/${solicitud.mascota_id.image}` : 'ruta/a/imagen/default.jpg',
          fechaAdopcion: solicitud.fecha_decision ? new Date(solicitud.fecha_decision).toLocaleDateString() : 'Fecha no disponible',
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
}    

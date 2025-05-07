import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuidador-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuidador-panel.component.html',
  styleUrls: ['./cuidador-panel.component.css']
})
export class CuidadorPanelComponent implements OnInit {
  solicitudes: any[] = [];

  constructor(
    private solicitudesService: SolicitudesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  // ✅ Cargar solicitudes de adopción del cuidador con manejo de error 404
  loadSolicitudes() {
    this.solicitudesService.getSolicitudesCuidador().subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.solicitudes = response;
          console.log('✔️ Solicitudes cargadas:', this.solicitudes);
        } else {
          this.solicitudes = [];
          console.warn('⚠️ No hay solicitudes disponibles.');
        }
      },
      (error: any) => {
        if (error.status === 404) {
          console.warn('⚠️ No se encontraron solicitudes, asignando lista vacía.');
          this.solicitudes = []; // Evita que se muestre error si no hay solicitudes
        } else {
          console.error('❌ Error al cargar las solicitudes:', error);
          this.showErrorAlert('Error al cargar las solicitudes');
        }
      }
    );
  }

  showErrorAlert(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

  navigateToAddPet() {
    this.router.navigate(['/cuidador/add-pet']);
  }

  navigateToCatsPanel() {
    this.router.navigate(['/cuidador/cats']);
  }

  navigateToDogsPanel() {
    this.router.navigate(['/cuidador/dogs']);
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-adoptador-panel',
    imports: [],
    templateUrl: './adoptador-panel.component.html',
    styleUrls: ['./adoptador-panel.component.css']
})
export class AdoptadorPanelComponent {
  adoptadorId: string | null = null;

  constructor(private router: Router) {
    // Obtener el ID del adoptador desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.adoptadorId = user.id || null;

    if (!this.adoptadorId) {
      console.error('ID del adoptador no encontrado en localStorage');
    }
  }

  irAActualizarFormulario(): void {
    if (this.adoptadorId) {
      this.router.navigate([`/dashboard/actualizar-formulario`, { adoptadorId: this.adoptadorId }]);
    } else {
      console.error("No se encontró el ID del adoptador. Asegúrate de estar logueado correctamente.");
    }
  }

  irAHistorialSolicitudes(): void {
    this.router.navigate(['/dashboard/historial-solicitudes']);
  }

  irAMascotasAdoptadas(): void {
    this.router.navigate(['/dashboard/mascotas-adoptadas']);
  }
}

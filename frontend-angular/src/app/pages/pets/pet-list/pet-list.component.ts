import { Component, OnInit } from '@angular/core';
import { PetService } from '../../pets/pet.service';
import { Router } from '@angular/router'; // Importa Router para navegación
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pet-list',
    imports: [CommonModule],
    templateUrl: './pet-list.component.html',
    styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {
  pets: any[] = [];

  constructor(private petService: PetService, private router: Router) {}

  ngOnInit(): void {
    this.loadPets();  // Llamamos a la función para cargar las mascotas
  }

  loadPets(): void {
    this.petService.getPets().subscribe(
      (data) => {
        this.pets = data;  // Asignamos las mascotas a la propiedad pets
      },
      (error) => {
        console.error('Error al obtener mascotas:', error);
      }
    );
  }

  // Función para ver detalles de la mascota
  viewDetails(petId: string): void {
    this.router.navigate([`/pet/${petId}`]); // Navega a la página de detalles
  }

  // Función para manejar la aprobación o rechazo de una mascota
  handlePetApproval(action: string, petId: string): void {
    Swal.fire({
      title: `¿Estás seguro de que quieres ${action} esta mascota?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.petService.handlePetApproval(action, petId).subscribe(
          () => {
            this.loadPets();  // Recargar las mascotas después de aprobar o rechazar
            Swal.fire('Hecho!', `La mascota ha sido ${action} con éxito.`, 'success');
          },
          (error: any) => {
            Swal.fire('Error', 'Hubo un problema al procesar la solicitud.', 'error');
          }
        );
      }
    });
  }
}

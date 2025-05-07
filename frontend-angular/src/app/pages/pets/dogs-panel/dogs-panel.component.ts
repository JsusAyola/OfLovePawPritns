import { Component, OnInit } from '@angular/core';
import { PetService } from '../pet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dogs-panel',
  templateUrl: './dogs-panel.component.html',
  styleUrls: ['./dogs-panel.component.css'],
  imports: [CommonModule, FormsModule, RouterModule] // Incluye RouterModule aquí
})
export class DogsPanelComponent implements OnInit {
  dogs: any[] = [];
  filteredDogs: any[] = [];
  selectedFilter: string = 'all';
  selectedDog: any = null;

  constructor(private petService: PetService, private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.loadDogs();
  }

  loadDogs() {
    this.petService.getPetsByCuidador().subscribe(
      (pets) => {
        this.dogs = pets.filter(pet => pet.type.toLowerCase() === 'perro');
        this.applyFilter();
      },
      (error) => {
        console.error('Error al cargar los perros:', error);
      }
    );
  }

  filterDogs(status: string) {
    this.selectedFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredDogs = this.dogs;
    } else {
      this.filteredDogs = this.dogs.filter(dog => dog.status === this.selectedFilter);
    }
  }

  editPet(dog: any) {
    this.selectedDog = { ...dog };
    setTimeout(() => {
      const modalElement = document.querySelector('.edit-modal');
      modalElement?.classList.add('show');
    }, 10);
  }

  updatePet() {
    if (!this.selectedDog) return;

    this.petService.updatePet(this.selectedDog._id, this.selectedDog).subscribe(
      () => {
        this.loadDogs();
        this.closeEditModal();
        Swal.fire('Actualizado', 'El perro ha sido actualizado con éxito.', 'success');
      },
      (error) => {
        console.error('Error al actualizar el perro:', error);
        Swal.fire('Error', 'No se pudo actualizar el perro.', 'error');
      }
    );
  }

  deletePet(dog: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente quieres eliminar a ${dog.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.petService.deletePet(dog._id).subscribe(
          () => {
            this.dogs = this.dogs.filter((d) => d._id !== dog._id);
            this.applyFilter();
            this.showSuccessAlert('Perro eliminado con éxito');
          },
          (error) => {
            console.error('Error al eliminar el perro:', error);
            this.showErrorAlert('Error al eliminar el perro');
          }
        );
      }
    });
  }

  closeEditModal() {
    this.selectedDog = null;
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      showConfirmButton: false,
      timer: 2000
    });
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

  verSolicitudesDeAdopcion() {
    this.router.navigate(['/cuidador/solicitudes-dogs'], { queryParams: { tipoMascota: 'Perro' } });
  }

  // Función para volver a la página anterior
  volverAtras(): void {
    this.location.back(); // Navega hacia la página anterior
  }
}

import { Component, OnInit } from '@angular/core';
import { PetService } from '../pet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cats-panel',
  templateUrl: './cats-panel.component.html',
  styleUrls: ['./cats-panel.component.css'],
  imports: [CommonModule, FormsModule, RouterModule] // Incluye RouterModule aquí
})
export class CatsPanelComponent implements OnInit {
  cats: any[] = [];
  filteredCats: any[] = [];
  selectedFilter: string = 'all';
  selectedCat: any = null;

  constructor(
    private petService: PetService,
    private router: Router,
    private location: Location // Inyecta Location para navegar atrás
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats() {
    this.petService.getPetsByCuidador().subscribe(
      (pets) => {
        this.cats = pets.filter(pet => pet.type.toLowerCase() === 'gato');
        this.applyFilter();
      },
      (error) => {
        console.error('Error al cargar los gatos:', error);
      }
    );
  }

  filterCats(status: string) {
    this.selectedFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredCats = this.cats;
    } else {
      this.filteredCats = this.cats.filter(cat => cat.status === this.selectedFilter);
    }
  }

  editPet(cat: any) {
    this.selectedCat = { ...cat };
    setTimeout(() => {
      const modalElement = document.querySelector('.edit-modal');
      modalElement?.classList.add('show');
    }, 10);
  }

  updatePet() {
    if (!this.selectedCat) return;

    this.petService.updatePet(this.selectedCat._id, this.selectedCat).subscribe(
      () => {
        this.loadCats();
        this.closeEditModal();
        Swal.fire('Actualizado', 'El gato ha sido actualizado con éxito.', 'success');
      },
      (error) => {
        console.error('Error al actualizar el gato:', error);
        Swal.fire('Error', 'No se pudo actualizar el gato.', 'error');
      }
    );
  }

  deletePet(cat: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente quieres eliminar a ${cat.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.petService.deletePet(cat._id).subscribe(
          () => {
            this.cats = this.cats.filter((c) => c._id !== cat._id);
            this.applyFilter();
            this.showSuccessAlert('Gato eliminado con éxito');
          },
          (error) => {
            console.error('Error al eliminar el gato:', error);
            this.showErrorAlert('Error al eliminar el gato');
          }
        );
      }
    });
  }

  closeEditModal() {
    this.selectedCat = null;
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
    this.router.navigate(['/cuidador/solicitudes-cats'], { queryParams: { tipoMascota: 'Gato' } });
  }

  // Método para retroceder a la página anterior
  irAtras(): void {
    this.location.back(); // Este método navega hacia la página anterior
  }
}

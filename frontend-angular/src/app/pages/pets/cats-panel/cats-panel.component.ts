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
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CatsPanelComponent implements OnInit {
  cats: any[] = [];
  filteredCats: any[] = [];
  selectedFilter: string = 'disponible';
  selectedCat: any = null;

  constructor(
    private petService: PetService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats() {
    this.petService.getAvailableApprovedPets('Gato').subscribe(
      (pets) => {
        this.cats = pets;
        this.applyFilter();
      },
      (error) => {
        console.error('Error al cargar los gatos:', error);
      }
    );
  }

  filterCats(status: string) {
    this.selectedFilter = status;
    if (status === 'disponible') {
      this.loadCats();
    } else if (status === 'solicitudes') {
      this.verSolicitudesDeAdopcion();
    }
  }

  applyFilter() {
    // Como ya traemos solo disponibles, solo asignamos
    this.filteredCats = this.cats;
  }

incrementInterest(pet: any) {
  this.petService.incrementInterestedCount(pet._id).subscribe(
    (res) => {
      pet.interestedCount = (pet.interestedCount || 0) + 1; // actualizar visualmente localmente
      Swal.fire('¡Listo!', 'El contador de interesados se actualizó.', 'success');
    },
    (err) => {
      Swal.fire('Error', 'No se pudo actualizar el contador.', 'error');
    }
  );
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

  irAtras(): void {
    this.location.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { PetService } from '../../pets/pet.service';
import { RouterModule } from '@angular/router';  // Importa RouterModule
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';  // Asegúrate de que CommonModule esté aquí

@Component({
    selector: 'app-admin-dashboard',
    imports: [CommonModule, RouterModule], // Asegúrate de que RouterModule esté aquí también
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  pets: any[] = [];
  cats: any[] = [];
  loggedUserId!: string;

  constructor(
    private userService: UserService,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadPendingPets();  // Cargar las mascotas pendientes de aprobación
    this.loggedUserId = localStorage.getItem('userId') || '';  // Obtener el ID del usuario logueado desde el localStorage
    this.loadCats();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

   // Método para cargar gatos disponibles
   loadCats(): void {
    this.petService.getPets().subscribe(
      (pets) => {
        this.cats = pets.filter(
          (pet) => pet.type.toLowerCase() === 'gato' && pet.status === 'disponible'
        );
      },
      (error) => {
        console.error('Error al obtener los gatos:', error);
      }
    );
  }

  loadPendingPets(): void {
    this.petService.getPendingPets().subscribe(
      (data: any) => {
        this.pets = data;  // Asignamos los datos de las mascotas pendientes a la propiedad pets
      },
      (error: any) => {
        console.error('Error al obtener mascotas pendientes:', error);
      }
    );
  }

  deleteUser(userId: string, userName: string): void {
    if (userId === this.loggedUserId) {
      console.error('No puedes eliminar tu propio usuario.');
      return;
    }

    Swal.fire({
      title: `¿Estás seguro de que quieres eliminar a ${userName}?`,
      text: "¡Este proceso es irreversible y eliminará toda su información!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.loadUsers();  // Recargar la lista de usuarios
            Swal.fire('Eliminado!', `${userName} ha sido eliminado.`, 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
          }
        );
      }
    });
  }

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
            this.loadPendingPets();  // Recargar las mascotas pendientes
            this.loadCats();  // Recargar la lista de gatos
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

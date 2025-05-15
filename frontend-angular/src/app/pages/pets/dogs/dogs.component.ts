import { Component, OnInit } from '@angular/core';
import { PetService } from '../pet.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-dogs',
    imports: [CommonModule],
    templateUrl: './dogs.component.html',
    styleUrls: ['./dogs.component.css']
})
export class DogsComponent implements OnInit {
  dogs: any[] = []; 

  constructor(private petService: PetService, private router: Router) {}

  ngOnInit(): void {
    this.loadDogs();

    // Solo ejecutar si estamos en un entorno de navegador
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

loadDogs() {
  this.petService.getAvailableApprovedPets('Perro').subscribe(
    (pets) => {
      this.dogs = pets;  // ya vienen solo aprobadas y disponibles
    },
    (error) => {
      console.error('Error al obtener los perros:', error);
    }
  );
}

  calculateDogAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const ageDifMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDifMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();

    let ageString = years > 0 ? `${years} año${years > 1 ? 's' : ''}` : '';
    ageString += months > 0 ? ` ${months} mes${months > 1 ? 'es' : ''}` : '';

    return ageString.trim() || 'Menos de 1 mes';
  }

  askAboutDog(dog: any) {
    const isLoggedIn = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (isLoggedIn && user && user.id) {
      // Solo redirige al formulario de adopción
      this.router.navigate([`/dashboard/adopcion-form`, 'new', dog._id]);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  
}

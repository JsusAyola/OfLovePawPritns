import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importa Router aquí
import { PetService } from '../../pets/pet.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // Importa RouterModule aquí

@Component({
    selector: 'app-pet-details',
    imports: [CommonModule, RouterModule], // Asegúrate de que RouterModule esté incluido
    templateUrl: './pet-details.component.html',
    styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit {
  pet: any = {}; 
  petId: string = ''; 
  age: number = 0; 

  constructor(
    private route: ActivatedRoute,  
    private petService: PetService,
    private router: Router  // Importa Router aquí
  ) {}

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('id') || '';

    if (this.petId) {
      this.petService.getPetById(this.petId).subscribe(
        (data) => {
          this.pet = data; 
          this.calculateAge();  
        },
        (error) => {
          console.error('Error al obtener los detalles de la mascota:', error);
        }
      );
    }
  }

  calculateAge(): void {
    const birthDate = new Date(this.pet.birthDate);  
    const ageDifMs = Date.now() - birthDate.getTime();  
    const ageDate = new Date(ageDifMs);  
    this.age = Math.abs(ageDate.getUTCFullYear() - 1970);  
  }

  goBack(): void {
    document.querySelector('.pet-details-container')?.classList.add('animate__animated', 'animate__fadeOutLeft');
    setTimeout(() => {
        this.router.navigate(['/admin-dashboard'], { relativeTo: this.route });
    }, 500); // Espera a que la animación termine antes de regresar
}
}

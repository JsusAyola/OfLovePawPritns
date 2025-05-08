import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredictionService } from '../services/prediction.service'; // Ajusta la ruta según tu estructura
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Necesario para Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-prediction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    BrowserAnimationsModule, // Habilitar animaciones para Angular Material
  ], // Necesario para formularios y Angular Material
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css']
})
export class PredictionFormComponent {
  predictionForm: FormGroup;
  predictionResult: any;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private predictionService: PredictionService
  ) {
    this.predictionForm = this.fb.group({
      type: ['', Validators.required],  // Tipo (Perro/Gato)
      breed: ['', Validators.required],  // Raza
      sex: ['', Validators.required],  // Sexo (Macho/Hembra)
      size: ['', Validators.required],  // Tamaño (Pequeno/Mediano/Grande)
      weight: ['', Validators.required],  // Peso
      vaccines: ['', Validators.required],  // Vacunas
      sterilized: ['', Validators.required],  // Esterilizado
      activityLevel: ['', Validators.required],  // Nivel de actividad
      behaviorPeople: ['', Validators.required],  // Comportamiento con personas
      behaviorAnimals: ['', Validators.required],  // Comportamiento con animales
      approvalStatus: ['', Validators.required],  // Estado de aprobación
      status: ['', Validators.required],  // Estado
      medicalConditions: [''],  // Condiciones médicas
      allergies: [''],  // Alergias
      ownershipConfirmation: ['', Validators.required]  // Confirmación de propiedad
    });
  }

  onSubmit() {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Envía la predicción al backend
      this.predictionService.predict(this.predictionForm.value).subscribe({
        next: (result) => {
          this.predictionResult = result;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al realizar la predicción';
          this.isLoading = false;
        }
      });
    }
  }

  resetForm() {
    this.predictionForm.reset();
  }
  
}

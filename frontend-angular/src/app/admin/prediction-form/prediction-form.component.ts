import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredictionService } from '../../services/prediction.service'; // Ajusta la ruta según tu estructura
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion'; // Asegúrate de importar MatExpansionModule

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
    MatExpansionModule, // Añadir MatExpansionModule para las expansiones
  ], // Necesario para formularios y Angular Material
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css']
})
export class PredictionFormComponent {
  predictionForm: FormGroup;
  predictionResult: any;
  isLoading = false;
  errorMessage: string | null = null;

  // Definimos las propiedades que usan los formularios en el HTML
  animalTypes: string[] = ['Perro', 'Gato'];
  breeds: string[] = ['Labrador', 'Bulldog', 'Persa', 'Husky', 'Siames', 'Mestizo'];
  sexes: string[] = ['Hembra', 'Macho'];
  sizes: string[] = ['Pequeño', 'Mediano', 'Grande'];
  weights: string[] = ['Menos de 5kg', '5-15kg', '15-30kg', 'Más de 30kg'];
  vaccines: string[] = ['Rabia', 'Parvovirus', 'Leptospirosis', 'Hepatitis Infecciosa Canina', 'Moquillo'];
  yesNoOptions: string[] = ['Sí', 'No'];
  activityLevels: string[] = ['Bajo', 'Medio', 'Alto'];
  behaviors: string[] = ['Tímido', 'Agresivo', 'Amigable', 'Territorial', 'Sociable'];
  medicalConditions: string[] = ['Ninguna', 'Afecciones respiratorias', 'Lesiones previas', 'Enfermedades crónicas'];
  allergies: string[] = ['Ninguna', 'Medicamentos', 'Polen', 'Polvo', 'Alimentos'];

  constructor(
    private fb: FormBuilder,
    private predictionService: PredictionService
  ) {
    // Crear el formulario con los controles correspondientes
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

  // Método para enviar la predicción
  onSubmit() {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Enviar los datos al servicio para la predicción
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

  // Método para limpiar el formulario y los resultados
  resetForm() {
    this.predictionForm.reset();  // Resetea el formulario
    this.predictionResult = null;  // Limpia los resultados de la predicción
  }
}

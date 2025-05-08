import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';  // Importando el servicio

@Component({
  selector: 'app-prediction-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css']
})
export class PredictionFormComponent {
  predictionForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  predictionResult: any;

  // Propiedades que usamos en los formularios del HTML
  animalTypes: string[] = ['Perro', 'Gato'];
  breeds: string[] = ['Labrador', 'Bulldog', 'Persa', 'Husky', 'Siames', 'Mestizo'];
  sexes: string[] = ['Hembra', 'Macho'];
  sizes: string[] = ['Pequeño', 'Mediano', 'Grande'];
  weights: string[] = ['Menos de 5kg', '5-15kg', '15-30kg', 'Más de 30kg'];
  vaccines: string[] = ['Rabia', 'Parvovirus', 'Leptospirosis', 'Hepatitis Infecciosa Canina', 'Moquillo'];
  yesNoOptions: string[] = ['Si', 'No'];
  activityLevels: string[] = ['Bajo', 'Medio', 'Alto'];
  behaviors: string[] = ['Timido', 'Agresivo', 'Territorial', 'Sociable'];
  medicalConditions: string[] = ['Ninguna', 'Afecciones respiratorias', 'Lesiones previas', 'Enfermedades crónicas'];
  allergies: string[] = ['Ninguna', 'Medicamentos', 'Polen', 'Polvo', 'Alimentos'];

  // Control de secciones de expansión
  isSectionOpen: { [key in 'basicInfo' | 'physicalCharacteristics' | 'vaccines' | 'sterilized' | 'activityLevel' | 'behaviorPeople' | 'behaviorAnimals' | 'approvalStatus' | 'status' | 'medicalConditions' | 'allergies' | 'ownershipConfirmation']: boolean } = {
    basicInfo: false,
    physicalCharacteristics: false,
    vaccines: false,
    sterilized: false,
    activityLevel: false,
    behaviorPeople: false,
    behaviorAnimals: false,
    approvalStatus: false,
    status: false,
    medicalConditions: false,
    allergies: false,
    ownershipConfirmation: false
  };

  // Inyección del servicio en el constructor
  constructor(private fb: FormBuilder, private predictionService: PredictionService) {
    this.predictionForm = this.fb.group({
      type: ['', Validators.required],
      breed: ['', Validators.required],
      sex: ['', Validators.required],
      size: ['', Validators.required],
      weight: ['', Validators.required],
      vaccines: ['', Validators.required],
      sterilized: ['', Validators.required],
      activityLevel: ['', Validators.required],
      behaviorPeople: ['', Validators.required],
      behaviorAnimals: ['', Validators.required],
      approvalStatus: ['', Validators.required],
      status: ['', Validators.required],
      medicalConditions: [''],
      allergies: [''],
      ownershipConfirmation: ['', Validators.required]
    });
  }

  // Método para alternar el estado de expansión/colapso de las secciones
  toggleSection(section: keyof typeof this.isSectionOpen): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  // Método para enviar el formulario
  onSubmit() {
    if (this.predictionForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Llamar al servicio para realizar la predicción
      this.predictionService.predict(this.predictionForm.value).subscribe({
        next: (result) => {
          this.predictionResult = result; // Suponemos que la respuesta tiene una propiedad 'message'
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.message || 'Error al realizar la predicción';
          this.isLoading = false;
        }
      });
    }
  }

  // Método para resetear el formulario y resultados
  resetForm() {
    this.predictionForm.reset();
    this.predictionResult = null;
    this.isLoading = false; // Aseguramos que el estado de carga se resetee
  }
}

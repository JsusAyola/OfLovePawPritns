import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-prediction-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatProgressBarModule],
  templateUrl: './prediction-form.component.html',
  styleUrls: ['./prediction-form.component.css']
})
export class PredictionFormComponent {
  predictionForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  predictionResult: any;

  animalTypes = ['Perro', 'Gato'];
  breeds = ['Labrador', 'Bulldog', 'Persa', 'Husky', 'Siames', 'Mestizo'];
  sexes = ['Hembra', 'Macho'];
  sizes = ['Pequeño', 'Mediano', 'Grande'];
  weights = ['Menos de 5kg', '5-15kg', '15-30kg', 'Más de 30kg'];
  vaccines = ['Rabia', 'Parvovirus', 'Leptospirosis', 'Hepatitis Infecciosa Canina', 'Moquillo'];
  yesNoOptions = ['Si', 'No'];
  activityLevels = ['Bajo', 'Medio', 'Alto'];
  behaviors = ['Timido', 'Agresivo', 'Territorial', 'Sociable'];
  medicalConditions = ['Ninguna', 'Afecciones respiratorias', 'Lesiones previas', 'Enfermedades crónicas'];
  allergies = ['Ninguna', 'Medicamentos', 'Polen', 'Polvo', 'Alimentos'];

  /** Aquí definimos cada sección que puede abrirse/cerrarse */
  isSectionOpen: Record<
    'basicInfo'|'vaccines'|'behaviorPeople'|'approvalStatus', 
    boolean
  > = {
    basicInfo:       false,
    vaccines:        false,
    behaviorPeople:  false,
    approvalStatus:  false
  };

  constructor(
    private fb: FormBuilder,
    private predictionService: PredictionService
  ) {
    this.predictionForm = this.fb.group({
      type:               ['', Validators.required],
      breed:              ['', Validators.required],
      sex:                ['', Validators.required],
      size:               ['', Validators.required],
      weight:             ['', Validators.required],
      vaccines:           ['', Validators.required],
      sterilized:         ['', Validators.required],
      activityLevel:      ['', Validators.required],
      behaviorPeople:     ['', Validators.required],
      behaviorAnimals:    ['', Validators.required],
      approvalStatus:     ['', Validators.required],
      status:             ['', Validators.required],
      medicalConditions:  [''],
      allergies:          [''],
      ownershipConfirmation: ['', Validators.required]
    });
  }

  /**
   * Al llamar a toggleSection('vaccines'):
   *  - todas las demás se ponen a false
   *  - sólo `vaccines` se invierte (si estaba cerrado => abre, si estaba abierto => cierra)
   */
  toggleSection(section: keyof typeof this.isSectionOpen): void {
    Object.keys(this.isSectionOpen)
      .forEach(key => {
        this.isSectionOpen[key as keyof typeof this.isSectionOpen] =
          (key === section)
            ? !this.isSectionOpen[key as keyof typeof this.isSectionOpen]
            : false;
      });
  }

  onSubmit(): void {
    if (!this.predictionForm.valid) return;
    this.isLoading = true;
    this.errorMessage = null;

    this.predictionService.predict(this.predictionForm.value).subscribe({
      next: result => {
        this.predictionResult = result;
        this.isLoading = false;
        this.disableFormFields();
      },
      error: err => {
        this.errorMessage = err.message || 'Error al realizar la predicción';
        this.isLoading = false;
      }
    });
  }

  /** Deshabilita todos los campos tras la predicción */
  private disableFormFields() {
    Object
      .values(this.predictionForm.controls)
      .forEach(control => control.disable());
  }

  resetForm(): void {
    this.predictionForm.reset();
    this.predictionResult = null;
    this.isLoading = false;
  }
}

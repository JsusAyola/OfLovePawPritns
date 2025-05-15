import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../services/prediction.service'; // Importamos el servicio
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prediction-history',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './prediction-history.component.html',
  styleUrls: ['./prediction-history.component.css']
})
export class PredictionHistoryComponent implements OnInit {
  predictionHistory: any[] = [];  // Para almacenar el historial de predicciones
  isLoading = true;               // Para mostrar un indicador de carga mientras obtenemos los datos
  errorMessage: string | null = null;  // Para mostrar mensajes de error

  constructor(private predictionService: PredictionService) { }

  ngOnInit(): void {
    this.loadPredictionHistory(); // Cargar el historial cuando el componente se inicializa
  }

  // Método para cargar el historial de predicciones
  loadPredictionHistory(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.predictionService.getUserPredictions().subscribe({
      next: (history) => {
        // Asegurarnos que history es un arreglo y que cada item tenga estructura esperada
        this.predictionHistory = Array.isArray(history) ? history : [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el historial de predicciones';
        this.isLoading = false;
      }
    });
  }
}

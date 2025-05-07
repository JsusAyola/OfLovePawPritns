import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-resetpasswordconfirmation',
    imports: [],
    templateUrl: './resetpasswordconfirmation.component.html',
    styleUrls: ['./resetpasswordconfirmation.component.css'] // Corrige "styleUrl" a "styleUrls"
})
export class ResetpasswordconfirmationComponent {

  constructor(private router: Router) {}

  // Método para navegar al sitio principal
  navigateToHome() {
    this.router.navigate(['/']); // Cambia esto según la ruta a la que quieras que se redirija
    window.scrollTo(0, 0);
  }
}

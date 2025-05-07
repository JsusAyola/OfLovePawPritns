import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
    selector: 'app-information',
    imports: [],
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css']
})
export class InformationComponent {
  constructor(private router: Router) {} // Inyecta Router

  redirectToRegister() {
    this.router.navigate(['/auth/register']); // Redirige a la página de registro
  }
}

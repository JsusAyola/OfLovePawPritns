import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { Router } from '@angular/router';

@Component({
    selector: 'app-recover-password',
    imports: [FormsModule], // Asegúrate de incluirlo aquí
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  email: string = ''; // Variable para almacenar el correo electrónico

  constructor(private router: Router) {}

  onSubmit() {
    if (this.email) {
      // Aquí iría la lógica para enviar el enlace de recuperación de contraseña
      console.log(`Se envió el enlace de recuperación a: ${this.email}`);
      alert('Se ha enviado un enlace de recuperación a tu correo.');
    } else {
      alert('Por favor, ingresa un correo electrónico válido.');
    }
  }

  // Método para navegar a la página de inicio de sesión
  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }
}

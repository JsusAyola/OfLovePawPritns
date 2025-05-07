import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
    imports: [FormsModule, CommonModule]
})
export class ChangePasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el token de la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.showModal('errorModal', 'Las contraseñas no coinciden.');
      return;
    }

    // Enviar la nueva contraseña y el token al backend
    this.http.post(`http://localhost:5000/api/auth/reset-password/${this.token}`, { password: this.newPassword })
      .subscribe(
        (response: any) => {
          this.showModal('successModal', 'Contraseña restablecida correctamente.');
          setTimeout(() => {
            this.router.navigate(['/auth/login']); // Redirigir al login después de 2 segundos
          }, 2000);
        },
        (error) => {
          console.error('Error al restablecer la contraseña:', error);
          this.showModal('errorModal', 'Error al restablecer la contraseña.');
        }
      );
  }

  showModal(modalId: string, message: string) {
    const modalElement = document.getElementById(modalId);
    const messageElement = document.getElementById(`${modalId}-message`);
    
    if (messageElement) {
      messageElement.textContent = message;
    }
  
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
  
      // Añadir el fondo oscuro de modal
      document.body.classList.add('modal-open');
    }
  }
  
  // Método para cerrar el modal
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
  
      // Remover el fondo oscuro de modal
      document.body.classList.remove('modal-open');
    }
  }
  
}

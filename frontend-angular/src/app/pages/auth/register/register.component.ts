import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    imports: [FormsModule, HttpClientModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  birthDate: string = '';
  role: string = '';
  phone: string = ''; // Solo requerido si el rol es 'Cuidador'
  showPassword: boolean = false;

  minDate: string = ''; // Fecha mínima para nacimiento
  maxDate: string = ''; // Fecha máxima para nacimiento

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const today = new Date();
    
    const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
    const minDateString = minDate.toISOString().split('T')[0]; 

    const maxDateString = today.toISOString().split('T')[0];

    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const minAgeDateString = minAgeDate.toISOString().split('T')[0];

    this.birthDate = minAgeDateString;  
    this.minDate = minDateString;    
    this.maxDate = maxDateString;    
  }

  onSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      const nameRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/;
      if (!nameRegex.test(this.firstName)) {
        this.showErrorAlert('Error en el Nombre', 'El nombre solo puede contener letras, tildes y la ñ.');
        return;
      }

      if (!nameRegex.test(this.lastName)) {
        this.showErrorAlert('Error en el Apellido', 'El apellido solo puede contener letras, tildes y la ñ.');
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/;
      if (!emailRegex.test(this.email)) {
        this.showErrorAlert('Error en el Correo', 'Por favor, ingresa un correo válido (Gmail, Outlook, Hotmail).');
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
      if (!passwordRegex.test(this.password)) {
        this.showErrorAlert('Error en la Contraseña', 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un símbolo.');
        return;
      }

      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        birthDate: this.birthDate,
        role: this.role,
        phone: this.role === 'cuidador' ? this.phone : null,
      };

      const birthDate = new Date(this.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.showErrorAlert('Error en la Edad', 'Debes tener al menos 18 años para registrarte.');
        return;
      }

      this.http.post('http://localhost:5000/api/auth/register', user).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: 'Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...',
            timer: 4000,
            showConfirmButton: false
          });
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          if (error.status === 400) {
            if (error.error.msg) {
              this.showErrorAlert('Error en el registro', error.error.msg);
            } else {
              this.showErrorAlert('Error en el registro', 'Datos incorrectos. Verifica tu información.');
            }
          } else {
            this.showErrorAlert('Error en el servidor', 'Hubo un problema al crear tu cuenta. Intenta nuevamente.');
          }
        }
      );
    } else {
      this.showErrorAlert('Formulario incompleto', 'Por favor, completa todos los campos correctamente.');
    }
  }

  showErrorAlert(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text
    });
  }
}

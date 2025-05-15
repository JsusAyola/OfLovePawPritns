import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../pages/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mi-cuenta',
    imports: [FormsModule, CommonModule],
    templateUrl: './mi-cuenta.component.html',
    styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent implements OnInit {
  selectedSection: string = 'MiInfo';
  userName: string = '';
  userLastName: string = '';
  userEmail: string = '';
  userRole: string = '';
  userPhone: string = '';
  userBirthDate: string = '';
  userRegistrationDate: string = '';
  userAge: number = 0;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get(`${this.apiUrl}/auth/me`, { headers }).subscribe(
        (response: any) => {
          this.userName = response.firstName;
          this.userLastName = response.lastName;
          this.userEmail = response.email;
          this.userRole = response.role;
          this.userPhone = response.phone || '';
          this.userBirthDate = response.birthDate;
          this.userRegistrationDate = new Date(response.createdAt).toLocaleDateString();
          this.calculateAge();
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: '¡Oh no!',
            text: 'Error al obtener los datos del usuario. Intenta recargar la página.',
            confirmButtonColor: '#c82333',
          });
        }
      );
    }
  }

  calculateAge() {
    if (this.userBirthDate) {
      const birthDate = new Date(this.userBirthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.userAge = age;
    }
  }

  updateInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const updatedData = {
        firstName: this.userName,
        lastName: this.userLastName,
        birthDate: this.userBirthDate,
        phone: this.userPhone
      };
  
      this.http.put('http://localhost:5000/api/user/update', updatedData, { headers }).subscribe(
        () => {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.firstName = this.userName;
          user.lastName = this.userLastName;
          localStorage.setItem('user', JSON.stringify(user));
  
          Swal.fire({
            icon: 'success',
            title: '¡Información actualizada!',
            text: 'Tus datos han sido guardados correctamente.',
            showConfirmButton: false,
            timer: 2500,
            toast: true,
            position: 'top-end',
          });
  
          this.authService.login(`${this.userName} ${this.userLastName}`, this.userRole || '');
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: '¡Ups!',
            text: 'No se pudo actualizar tu información. Por favor, intenta de nuevo.',
            confirmButtonColor: '#c82333',
          });
        }
      );
    }
  }
  
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Las contraseñas no coinciden. Por favor, verifica.',
        confirmButtonColor: '#c82333',
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const passwordData = { currentPassword: this.currentPassword, newPassword: this.newPassword };

      this.http.put(`${this.apiUrl}/user/change-password`, passwordData, { headers }).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña actualizada!',
            text: 'Tu contraseña ha sido cambiada exitosamente.',
            showConfirmButton: false,
            timer: 2500,
            toast: true,
            position: 'top-end',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: '¡Error al cambiar la contraseña!',
            text: error.error.msg || 'No se pudo cambiar la contraseña. Inténtalo nuevamente.',
            confirmButtonColor: '#c82333',
          });
        }
      );
    }
  }

  accountBtn(section: string) {
    this.selectedSection = section;
  }

  openPowerBIDashboard() {
    this.router.navigate(['/powerbi']);
  }
}

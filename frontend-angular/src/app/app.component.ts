import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './pages/auth/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pawprint';
  userName: string | null = null;
  userRole: string | null = null;
  userId: string | null = null;

  // Modal control
  isModalOpen: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userRole = user.role;

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        this.userId = storedUser?.id || null;

        if (this.userId) {
        }
      }
    });

    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    if (isBrowser) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.firstName && user.lastName && user.role) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.userRole = user.role;
        if (this.userName && this.userRole) {
          this.authService.login(this.userName, this.userRole);
        }
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.logout();
    window.location.href = '/';
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
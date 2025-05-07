import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambiamos el tipo a un objeto que tiene `name` y `role`
  private userSubject = new BehaviorSubject<{ name: string, role: string } | null>(null); 

  // Observable que se actualizará con el nombre y rol del usuario
  user$ = this.userSubject.asObservable();

  // Método para iniciar sesión y emitir el nombre y rol del usuario
  login(userName: string, userRole: string) {
    this.userSubject.next({ name: userName, role: userRole });
  }

  // Método para cerrar sesión
  logout() {
    this.userSubject.next(null);
  }

  updateUserName(newName: string) {
    const currentUser = this.userSubject.value;
    if (currentUser) {
      this.userSubject.next({ ...currentUser, name: newName });
    }
}
}

import { Routes } from '@angular/router';
import { CatsComponent } from './cats/cats.component';
import { DogsComponent } from './dogs/dogs.component';
import { PetAddComponent } from './pet-add/pet-add.component';
export const MascotasRoutes: Routes = [
  { path: '', redirectTo: 'cats', pathMatch: 'full' }, // Redirige a 'cats' por defecto
  { path: 'cats', component: CatsComponent }, // Sección de gatos
  { path: 'dogs', component: DogsComponent }, // Sección de perros
  { path: 'add-pet', component: PetAddComponent },
  {path: 'cats-panel',component: CatsComponent},
  {path: 'dogs-panel',component: DogsComponent},
];

import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './home/inicio/inicio.component';
import { ComoAdoptarRoutes } from './home/como-adoptar/como-adoptar.routes';
import { CatsComponent } from './pages/pets/cats/cats.component';
import { DogsComponent } from './pages/pets/dogs/dogs.component';
import { ProximamenteComponent } from './pages/pets/proximamente/proximamente.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { ResetpasswordconfirmationComponent } from './pages/auth/resetpasswordconfirmation/resetpasswordconfirmation.component';
import { ChangePasswordComponent } from './pages/auth/change-password/change-password.component';
import { InformationComponent } from './pages/auth/information/information.component';
import { MiCuentaComponent } from './admin/mi-cuenta/mi-cuenta.component';
import { AuthGuard } from './pages/auth/auth-guard.guard';
import { CuidadorGuard } from './pages/auth/cuidador.guard'; 
import { CuidadorPanelComponent } from './admin/cuidador-panel/cuidador-panel.component';
import { AdopcionFormComponent } from './admin/adopcion-form/adopcion-form.component';
import { PerfilAdoptadorComponent } from './admin/perfil-adoptador/perfil-adoptador.component';
import { SolicitudesAdopcionComponent } from './pages/pets/solicitudes-adopcion/solicitudes-adopcion.component';
import { FuncionesRolesComponent } from './home/funciones-roles/funciones-roles.component';
import { AdoptadorPanelComponent } from './admin/adoptador-panel/adoptador-panel.component';
import { AdoptadorGuard } from './pages/auth/adoptador.guard';
import { HistorialSolicitudesComponent } from './admin/historial-solicitudes/historial-solicitudes.component';
import { MascotasAdoptadasComponent } from './admin/mascotas-adoptadas/mascotas-adoptadas.component';
import { PowerBIDashboardComponent } from './admin/power-bidashboard/power-bidashboard.component';
import { AdminDashboardComponent } from './pages/auth/admin-dashboard/admin-dashboard.component';
import { PetListComponent } from './pages/pets/pet-list/pet-list.component';
import { PetDetailsComponent } from './pages/pets/pet-details/pet-details.component';
import { PetAddComponent } from './pages/pets/pet-add/pet-add.component';
import { CatsPanelComponent } from './pages/pets/cats-panel/cats-panel.component';
import { DogsPanelComponent } from './pages/pets/dogs-panel/dogs-panel.component';
import { VerFormularioAdopcionComponent } from './admin/ver-formulario-adopcion/ver-formulario-adopcion.component';
import { PredictionFormComponent } from './admin/prediction-form/prediction-form.component'; // Asegúrate de importar el componente
import { PredictionHistoryComponent } from './home/prediction-history/prediction-history.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'como-adoptar', children: ComoAdoptarRoutes },
    { path: 'funciones-roles', component: FuncionesRolesComponent },
    { path: 'cats', component: CatsComponent },
    { path: 'dogs', component: DogsComponent },
    { path: 'proximamente', component: ProximamenteComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'auth/reset-password', component: ResetPasswordComponent },
    { path: 'auth/reset-password-confirmation', component: ResetpasswordconfirmationComponent },
    { path: 'auth/change-password/:token', component: ChangePasswordComponent },
    { path: 'auth/information', component: InformationComponent },
    { path: '', redirectTo: '/dashboard/cuidador-panel', pathMatch: 'full' },
    { path: 'powerbi', component: PowerBIDashboardComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'pet/:id', component: PetDetailsComponent },
    // { path: 'pets', component: PetListComponent },

    { 
      path: 'prediction-form', 
      component: PredictionFormComponent, // Opcional: protege la ruta si es necesario
    },
    { path: 'prediction-history', component: PredictionHistoryComponent, canActivate: [AuthGuard]},
    { 
      path: 'dashboard/mi-cuenta', 
      component: MiCuentaComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'dashboard/cuidador-panel', 
      component: CuidadorPanelComponent, 
      canActivate: [CuidadorGuard]
    },
    { 
      path: 'dashboard/adoptador-panel', 
      component: AdoptadorPanelComponent, 
      canActivate: [AdoptadorGuard]
    },          
    {
      path: 'dashboard/historial-solicitudes',
      component: HistorialSolicitudesComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'dashboard/mascotas-adoptadas',
      component: MascotasAdoptadasComponent,
      canActivate: [AuthGuard]
    },
    { 
      path: 'dashboard/adopcion-form/:solicitudId/:mascotaId', 
      component: AdopcionFormComponent, 
      canActivate: [AuthGuard]  
    },
    { 
      path: 'dashboard/perfil-adoptador/:id', 
      component: PerfilAdoptadorComponent, 
      canActivate: [CuidadorGuard] 
    },    
    { 
      path: 'cuidador/add-pet', 
      component: PetAddComponent, 
      canActivate: [CuidadorGuard] 
    },
    { 
      path: 'cuidador/cats', 
      component: CatsPanelComponent, 
      canActivate: [CuidadorGuard]
    },
    { 
      path: 'cuidador/dogs', 
      component: DogsPanelComponent, 
      canActivate: [CuidadorGuard] 
    },
    { path: 'cuidador/solicitudes-tipo',
      component:SolicitudesAdopcionComponent,
      canActivate: [CuidadorGuard],
    },
    {path: 'cuidador/ver-formulario-adopcion/:adoptadorId/:solicitudId', 
      component: VerFormularioAdopcionComponent, 
      canActivate: [CuidadorGuard],
    },

    // Rutas para las solicitudes de adopción específicas de gatos y perros
    { 
      path: 'cuidador/solicitudes-cats', 
      component: SolicitudesAdopcionComponent, 
      canActivate: [CuidadorGuard], 
      data: { tipoMascota: 'gato' }  // Enviamos el tipo de mascota
    },
    { 
      path: 'cuidador/solicitudes-dogs', 
      component: SolicitudesAdopcionComponent, 
      canActivate: [CuidadorGuard], 
      data: { tipoMascota: 'perro' }  // Enviamos el tipo de mascota
    },
    //{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

export const routingModule = RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'top',  
  anchorScrolling: 'enabled',  
});
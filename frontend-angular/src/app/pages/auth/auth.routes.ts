import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InformationComponent } from './information/information.component';
import { ResetpasswordconfirmationComponent } from './resetpasswordconfirmation/resetpasswordconfirmation.component';

export const AuthRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'information', component: InformationComponent},
    { path: 'reset-password-confirmation', component: ResetpasswordconfirmationComponent }
];
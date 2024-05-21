import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { HomeComponent } from './modules/home/home.component';
import { ImgComponent } from './modules/img/img.component';
import { ProfileComponent } from './modules/profile/profile.component';

export const routes: Routes = [
    { path: '' , redirectTo:'login' , pathMatch: 'full'},
    { path: 'login' , component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'home',  component: HomeComponent},
    { path: 'img', component: ImgComponent},
    { path: 'profile', component: ProfileComponent},
];
    
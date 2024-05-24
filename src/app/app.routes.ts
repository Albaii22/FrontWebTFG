import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { HomeComponent } from './modules/home/home.component';
import { ImgComponent } from './modules/img/img.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { UsersViewComponent } from './modules/users-view/users-view.component';
import { AuthGuard } from './guards/auth-guard/auth-guard.component';

export const routes: Routes = [
    { path: '' , redirectTo:'login' , pathMatch: 'full'},
    { path: 'login' , component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'home',  component: HomeComponent , canActivate: [AuthGuard]},
    { path: 'img', component: ImgComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'users', component: UsersViewComponent, canActivate: [AuthGuard]},
];
    
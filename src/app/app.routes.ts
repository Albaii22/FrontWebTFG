import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { HomeComponent } from './modules/home/home.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { UsersViewComponent } from './modules/users-view/users-view.component';
import { AuthGuard } from './guards/auth-guard/auth-guard.component';

export const routes: Routes = [
    // Default route redirects to login
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // Route for login
    { path: 'login', component: LoginComponent },
    // Route for register
    { path: 'register', component: RegisterComponent },
    // Route for home with authentication guard
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    // Route for profile with authentication guard
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    // Route for user view with authentication guard
    { path: 'users', component: UsersViewComponent, canActivate: [AuthGuard] },
];

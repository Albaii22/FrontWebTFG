import { Component } from '@angular/core';
import { RegisterI } from '../../interfaces/register.interface';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { LoginI } from '../../interfaces/login.interface';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AboutmeComponent } from '../modales/aboutme/aboutme.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // Object to store the data from the registration form
RegisterForm = {
  username: '', // Field for the username
  email: '',    // Field for the email
  password: ''  // Field for the password
}

constructor(
  private authService: AuthService,    // Authentication service
  private router: Router,              // Routing service
  private tokenService: TokenService,  // Service to manage authentication token
  private userService: UserService,    // User service
  private dialog: MatDialog             // Service to open the registration modal
) {}

// Method to register a new user
Register(form: RegisterI): void {
  // Check if the username and password are not empty
  if (this.RegisterForm.username !== '' && this.RegisterForm.password !== '') {
    // Make a registration request to the server
    this.authService.Register(form).subscribe({
      next: (data) => { // Handle successful server response
        // Set the token received from the server
        this.tokenService.setToken(data.token);
        // Build a login form object with the provided username and password
        const loginForm: LoginI = {
          username: form.username,
          password: form.password
        };
        // Attempt auto-login with the login form
        this.authService.Login(loginForm).subscribe({
          next: (loginData) => { // Handle successful auto-login response
            // Set the token received from the auto-login
            this.tokenService.setToken(loginData.token);
            // Open additional registration modal
            this.openRegisterModal(); 
          },
          error: (loginErr) => { // Handle errors during auto-login
            // Show an error message indicating auto-login has failed
            Swal.fire({
              icon: 'error',
              title: 'Auto Login Failed',
              text: 'There was an error during the auto login process.',
            });
          }
        });
      },
      error: (err) => { // Handle errors during registration
        // Show an error message indicating an error occurred during the registration process
        Swal.fire({
          icon: 'error',
          title: 'Invalid data',
          text: 'There was an error during the registration process.',
        });
      }
    });
  } else {
    // Show a warning indicating some fields in the registration form are incomplete
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete data',
      text: 'Please fill out all required fields.',
    });
  }
}

// Method to open the additional registration modal
openRegisterModal(): void {
  const dialogRef = this.dialog.open(AboutmeComponent, {
    width: '400px',
    data: { username: this.RegisterForm.username } // Pass the username to the modal
  });

  dialogRef.afterClosed().subscribe(result => {
    // Navigate to the home page if the user completed the additional registration modal
    if (result) {
      this.router.navigate(['/home']);
    }
  });
}

// Method to navigate to the login page
goToLogin() {
  this.router.navigate(['/login']);
}

}

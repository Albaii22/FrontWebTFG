import { Component } from '@angular/core';
import { RegisterI } from '../../../interfaces/register.interface';
import { AuthService } from '../../../services/authService/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  RegisterForm = {
    username: '',
    email: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router) {}

  Register(form: RegisterI): void {
    if (this.RegisterForm.username !== '' || this.RegisterForm.password !== '') {
      this.authService.Register(form).subscribe({
        next: (data) => {
          Swal.fire({
            icon: 'success',
            title: 'Successful register!',
            text: 'You have registered successfully.',
          });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Invalid data',
            text: 'There was an error during the registration process.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please fill out all required fields.',
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}

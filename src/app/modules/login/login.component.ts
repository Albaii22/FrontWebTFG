import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LoginI } from '../../interfaces/login.interface';
import { AuthService } from '../../services/authService/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule , FormsModule , HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  LoginForm = {
    username: '',
    password: ''
  }

  constructor(private authService: AuthService , private router: Router) {}

  Login(form: LoginI): void {
    if (this.LoginForm.username !== '' || this.LoginForm.password !== '') {
      this.authService.Login(form).subscribe({
        next: (data) => {
          console.log('Succesfull Login!!' , data);
          this.router.navigate([]);
        },
        error: (err) => {
          console.log('Ivalid data', err);
        }
      });
    } else {
      console.log('No data on username and password');
    }
  }
  
  
}
 
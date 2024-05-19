import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  username = this.userService.getUsernameFromToken();

  ngOnInit(): void {
    console.log(this.userService.getUsuarioIdByUsername(this.username).subscribe(data => console.log(data)));
   
  }

  constructor(private userService: UserService) {}

}

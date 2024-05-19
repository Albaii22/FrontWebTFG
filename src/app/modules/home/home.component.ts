import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token/token.service';
import { UserService } from '../../services/user/user.service';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  username = this.userService.getUsernameFromToken();

  constructor( private userService: UserService, private publicationsService: PublicationsService ) {}

  ngOnInit(): void {
    console.log(this.userService.getUsuarioIdByUsername(this.username).subscribe(data => console.log(data)));
   
  }

  createPublication(publication: PublicationI, userId: number): void {
    this.publicationsService.createPublication(publication, userId).subscribe(
      (response) => {
        console.log('Publication created:', response);
      },
      (error) => {
        console.error('Error creating publication:', error);
      }
    );
  }

 

}

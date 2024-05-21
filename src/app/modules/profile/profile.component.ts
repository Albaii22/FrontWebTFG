import { Component } from '@angular/core';
import { HelpersService } from '../../services/helpers/helpers.service';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  username = this.userService.getUsernameFromToken();
  tweetContent = '';

  constructor(
    private userService: UserService,
    private helperService: HelpersService,
    private publicationsService: PublicationsService
  ) {}

  ngOnInit(): void {
  }

  showNewPostModal(): void {
    Swal.fire({
      title: 'New Post',
      input: 'textarea',
      inputPlaceholder: 'What\'s happening?',
      showCancelButton: true,
      confirmButtonText: 'Post',
      preConfirm: (content) => {
        if (content === '') {
          Swal.showValidationMessage('Please enter a tweet.');
          return false;
        }
        return content;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.tweetContent = result.value;
        const newPublication: PublicationI = {
          id: 0,
          user_id: this.helperService.getUserId(),
          content: this.tweetContent,
          vote_count: 0,
          timestamp: new Date().toISOString(),
          comments: [{
            content: '',
            publicationId: 0
          }]
        };
    
        this.publicationsService.createPublication(newPublication, this.helperService.getUserId()).subscribe(
          response => {
            console.log('Publication created:', response);
            this.tweetContent = '';
            this.loadUserPublications();
          },
          error => {
            console.error('Error creating publication:', error);
          }
        );
      }
    });
  }

  loadUserPublications(): void {
    console.log("user publications")
}

}
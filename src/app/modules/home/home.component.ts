import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';
import { HelpersService } from '../../services/helpers/helpers.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgFor, NgScrollbarModule , NavbarComponent , FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username = this.userService.getUsernameFromToken();
  tweetContent: string = '';
  publications: PublicationI[] = [];
  publicationUsernames: { [key: number]: string } = {};

  constructor(
    private userService: UserService,
    private publicationsService: PublicationsService,
    private helperService: HelpersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUsuarioIdByUsername(this.username).subscribe(
      data => this.helperService.setUserId(data)
     
    );
    this.loadPublications();
  }

  loadPublications(): void {
    this.publicationsService.getAllPublications().subscribe(
      data => {
        console.log(data);
        this.publications = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.loadUsernames();
      }
    );
  }

  loadUsernames(): void {
    this.publications.forEach(publication => {
      this.userService.getUserById(publication.user_id).subscribe(user => {
        this.publicationUsernames[publication.id] = user.username;
      });
    });
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
        this.createPublication();
      }
    });
  }

  createPublication(): void {
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
        this.loadPublications();
      },
      error => {
        console.error('Error creating publication:', error);
      }
    );
  }

  getTimeSince(timestamp: string): string {
    const now = new Date();
    const publicationDate = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - publicationDate.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' años';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' días';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutos';

    return Math.floor(seconds) + ' segundos';
  }

  navigateToProfile(): void {
    this.helperService.navigateTo('/profile');
  }

  navigateToHome(): void {
    this.helperService.navigateTo('/home');
  }

  navigateToFollowing() {
    this.helperService.navigateTo('/users');
  }

  confirmDeletePublication(publicationId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePublication(publicationId);
        this.loadPublications();
      }
    });
  }

  deletePublication(publicationId: number): void {
    this.publicationsService.deletePublication(publicationId).subscribe(
      () => {
        Swal.fire(
          'Deleted!',
          'Your publication has been deleted.',
          'success'
        );
        this.loadPublications();
      },
      error => {
        console.error('Error deleting publication:', error);
        Swal.fire(
          'Error!',
          'There was an error deleting your publication.',
          'error'
        );
      }
    );
  }

  editPublication(publication: PublicationI): void {
    Swal.fire({
      title: 'Edit Post',
      input: 'textarea',
      inputValue: publication.content,
      showCancelButton: true,
      confirmButtonText: 'Save',
      preConfirm: (content) => {
        if (content === '') {
          Swal.showValidationMessage('Please enter a tweet.');
          return false;
        }
        return content;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.updatePublication(publication.id, result.value);
      }
    });
  }

  updatePublication(publicationId: number, newContent: string): void {
    const updatedPublication: PublicationI = { ...this.publications.find(pub => pub.id === publicationId), content: newContent } as PublicationI;

    this.publicationsService.updatePublication(publicationId, updatedPublication).subscribe(
      () => {
        Swal.fire(
          'Updated!',
          'Your publication has been updated.',
          'success'
        );
        this.loadPublications();
      },
      error => {
        console.error('Error updating publication:', error);
        Swal.fire(
          'Error!',
          'There was an error updating your publication.',
          'error'
        );
      }
    );
  }
}

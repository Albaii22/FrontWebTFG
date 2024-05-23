import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpersService } from '../../services/helpers/helpers.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import Swal from 'sweetalert2';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';
import { UserService } from '../../services/user/user.service';
import { userI } from '../../interfaces/user.interface';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, FooterComponent],
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent implements OnInit {
  tweetContent: string = '';
  username = this.userService.getUsernameFromToken();
  users: userI[] = [];
  selectedUser: userI | null = null;
  selectedUserPublications: PublicationI[] = [];

  constructor(
    private router: Router,
    private helperService: HelpersService,
    private publicationsService: PublicationsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  navigateToFollowing() {
    this.helperService.navigateTo('/users');
  }

  navigateToProfile(): void {
    this.helperService.navigateTo('/profile');
  }

  navigateToHome(): void {
    this.helperService.navigateTo('/home');
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
          comments: []
        };

        this.publicationsService.createPublication(newPublication, this.helperService.getUserId()).subscribe(
          response => {
            console.log('Publication created:', response);
            this.tweetContent = '';
          },
          error => {
            console.error('Error creating publication:', error);
          }
        );
      }
    });
  }

  viewUserProfile(user: userI): void {
    this.selectedUser = user;
    this.loadUserPublications(user.id);
  }

  loadUserPublications(userId: number): void {
    this.publicationsService.getPublicationsByUserId(userId).subscribe(
      publications => {
        this.selectedUserPublications = publications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
      error => {
        console.error('Error fetching user publications:', error);
      }
    );
  }

  closeUserProfile(): void {
    this.selectedUser = null;
    this.selectedUserPublications = [];
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
}

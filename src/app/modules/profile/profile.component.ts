import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../../services/helpers/helpers.service';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommentComponent } from '../modales/comment/comment.component';
import { NewPostComponent } from '../modales/new-post/new-post.component';
import { EditPostComponent } from '../modales/edit-post/edit-post.component';
import { EditProfileComponent } from '../modales/edit-profile/edit-profile.component';
import { CommentsI } from '../../interfaces/comments.interface';
import { CommentsService } from '../../services/comments/comments.service';
import { userUpdateI } from '../../interfaces/userUpdate.interface';
import { ViewPostComponent } from '../modales/view-post/view-post.component';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = this.userService.getUsernameFromToken();
  tweetContent = '';
  userPublications: PublicationI[] = [];
  registrationDate: Date = new Date();
  profileImageUrl: string = '../../assets/img/profile.png';
  aboutMe: string = '';
  commentContent: string = '';
  currentPublication: PublicationI | null = null;
  currentUserId: number = 0;
  userId = this.helperService.getUserId();

  constructor(
    private userService: UserService,
    private helperService: HelpersService,
    private publicationsService: PublicationsService,
    private dialog: MatDialog,
    private commentsService: CommentsService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.userService.getUsuarioIdByUsername(this.username).subscribe(
      user => {
        this.helperService.setUserId(user);
        if (user.profileImageUrl) {
          this.profileImageUrl = user.profileImageUrl;
        }
        this.currentUserId = user;
        this.loadUserPublications();
      },
      error => {
        console.error('Error fetching user id data:', error);
      }
    );

    this.userService.getUserById(this.helperService.getUserId()).subscribe(
      user => {
        this.registrationDate = new Date(user.registration_date);
        this.aboutMe = user.aboutMe;
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );

    console.log(this.helperService.getUserId());
  }

  showNewPostModal(): void {
    const dialogRef = this.dialog.open(NewPostComponent, {
      width: '500px',
      data: { tweetContent: this.tweetContent }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tweetContent = result;
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
      comments: [],
      liked_by_user: false,
      likedBy: []
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

  loadUserPublications(): void {
    const userId = this.helperService.getUserId();
    if (userId) {
      this.publicationsService.getPublicationsByUserId(userId).subscribe(
        publications => {
          this.userPublications = publications.map(publication => ({
            ...publication,
            liked_by_user: publication.likedBy.includes(this.currentUserId)
          })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        },
        error => {
          console.error('Error fetching user publications:', error);
        }
      );
    } else {
      console.error('User ID is undefined');
    }
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
        this.loadUserPublications();
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
        this.loadUserPublications();
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
    const dialogRef = this.dialog.open(EditPostComponent, {
      width: '500px',
      data: { publication: publication }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePublication(publication.id, result);
      }
    });
  }

  updatePublication(publicationId: number, newContent: string): void {
    const updatedPublication: PublicationI = { ...this.userPublications.find(pub => pub.id === publicationId), content: newContent } as PublicationI;

    this.publicationsService.updatePublication(publicationId, updatedPublication).subscribe(
      () => {
        Swal.fire(
          'Updated!',
          'Your publication has been updated.',
          'success'
        );
        this.loadUserPublications();
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

  editProfile(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '500px',
      data: { 
        username: this.username, 
        aboutMe: this.aboutMe, 
        profileImageUrl: this.profileImageUrl 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { username, aboutMe } = result;
        const updatedUser: userUpdateI = {
          username,
          aboutMe,
          profileImageUrl: this.profileImageUrl
        };

        this.userService.updateUsuario(this.helperService.getUserId(), updatedUser).subscribe(
          () => {
            Swal.fire(
              'Updated!',
              'Your profile has been updated. Log In again.',
              'success'
            );
            this.username = username;
            this.aboutMe = aboutMe;
            this.helperService.navigateTo('/login');+
            this.tokenService.removeToken();
          },
          error => {
            console.error('Error updating profile:', error);
            Swal.fire(
              'Error!',
              'There was an error updating your profile.',
              'error'
            );
          }
        );
      }
    });
  }

  showCommentModal(publication: PublicationI): void {
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '500px',
      data: { 
        currentPublication: publication, 
        publicationUsername: this.username
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentContent = result;
        this.currentPublication = publication;
        this.createComment();
      }
    });
  }

  createComment(): void {
    if (this.currentPublication) {
      const newComment: CommentsI = {
        content: this.commentContent,
        timestamp: new Date().toISOString(),
        publicationId: this.currentPublication.id,
        userId: this.helperService.getUserId()
      };

      this.commentsService.createComment(newComment, this.helperService.getUserId()).subscribe(
        response => {
          console.log('Comment created:', response);
          this.commentContent = '';
          this.loadUserPublications();
        },
        error => {
          console.error('Error creating comment:', error);
        }
      );
    }
  }

  toggleLike(publication: PublicationI): void {
    this.publicationsService.toggleLike(publication.id, this.currentUserId).subscribe(
      () => {
        publication.liked_by_user = !publication.liked_by_user;
        publication.vote_count += publication.liked_by_user ? 1 : -1;
      },
      error => {
        console.error('Error toggling like:', error);
      }
    );
  }

  viewPublication(publication: PublicationI, event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).tagName === 'I') {
      return;
    }

    this.dialog.open(ViewPostComponent, {
      width: '500px',
      data: { publication: publication, publicationUsernames: { [publication.id]: this.username } }
    });
  }
}

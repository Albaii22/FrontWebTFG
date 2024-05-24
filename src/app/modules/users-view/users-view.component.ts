import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpersService } from '../../services/helpers/helpers.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';
import { UserService } from '../../services/user/user.service';
import { userI } from '../../interfaces/user.interface';
import { NewPostComponent } from '../modales/new-post/new-post.component';
import { EditPostComponent } from '../modales/edit-post/edit-post.component';
import { CommentComponent } from '../modales/comment/comment.component';
import { ViewPostComponent } from '../modales/view-post/view-post.component';
import Swal from 'sweetalert2';
import { CommentsService } from '../../services/comments/comments.service';
import { CommentsI } from '../../interfaces/comments.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    FormsModule,
    FooterComponent,
    MatDialogModule,
    NewPostComponent,
    CommentComponent,
    ViewPostComponent,
    EditPostComponent
  ],
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent implements OnInit {
  tweetContent: string = '';
  username = this.userService.getUsernameFromToken();
  users: userI[] = [];
  selectedUser: userI | null = null;
  selectedUserPublications: PublicationI[] = [];
  currentUserId: number = 0;
  commentContent: string = '';
  currentPublication: PublicationI | null = null;
  isCurrentUserProfile: boolean = false;

  constructor(
    private router: Router,
    private helperService: HelpersService,
    private publicationsService: PublicationsService,
    private userService: UserService,
    private commentsService: CommentsService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userService.getUsuarioIdByUsername(this.username).subscribe(
      data => {
        this.currentUserId = data;
        console.log(this.currentUserId);
      },
      error => {
        console.error('Error fetching user id:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      users => {
        this.users = users.map(user => ({
          ...user,
          profileImageUrl: user.profileImageUrl ? `http://localhost:8082/${decodeURIComponent(user.profileImageUrl)}` : '../../assets/img/profile.png'
        }));
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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
        if (this.selectedUser && this.selectedUser.id === this.currentUserId) {
          this.loadUserPublications(this.currentUserId);
        }
      },
      error => {
        console.error('Error creating publication:', error);
      }
    );
  }

  viewUserProfile(user: userI): void {
    this.selectedUser = user;
    this.isCurrentUserProfile = (user.id === this.currentUserId);
    this.loadUserPublications(user.id);
  }

  loadUserPublications(userId: number): void {
    this.publicationsService.getPublicationsByUserId(userId).subscribe(
      publications => {
        this.selectedUserPublications = publications.map(publication => ({
          ...publication,
          liked_by_user: publication.likedBy.includes(this.currentUserId)
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
    const updatedPublication: PublicationI = { ...this.selectedUserPublications.find(pub => pub.id === publicationId), content: newContent } as PublicationI;

    this.publicationsService.updatePublication(publicationId, updatedPublication).subscribe(
      () => {
        Swal.fire(
          'Updated!',
          'Your publication has been updated.',
          'success'
        );
        this.loadUserPublications(this.selectedUser?.id || this.currentUserId);
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
        this.loadUserPublications(this.selectedUser?.id || this.currentUserId);
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

  showCommentModal(publication: PublicationI): void {
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '500px',
      data: { 
        currentPublication: publication, 
        publicationUsername: this.selectedUser?.username 
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
        userId: this.helperService.getUserId(),
      };

      this.commentsService.createComment(newComment, this.helperService.getUserId()).subscribe(
        response => {
          console.log('Comment created:', response);
          this.commentContent = '';
          this.loadUserPublications(this.selectedUser?.id || this.currentUserId);
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
}

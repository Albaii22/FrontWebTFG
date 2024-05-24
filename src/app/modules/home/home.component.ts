import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { PublicationI } from '../../interfaces/publications.interface';
import { PublicationsService } from '../../services/publications/publications.service';
import { HelpersService } from '../../services/helpers/helpers.service';
import { CommentsService } from '../../services/comments/comments.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewPostComponent } from '../modales/new-post/new-post.component';
import { CommentComponent } from '../modales/comment/comment.component';
import { ViewPostComponent } from '../modales/view-post/view-post.component';
import { EditPostComponent } from '../modales/edit-post/edit-post.component';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommentsI } from '../../interfaces/comments.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    NewPostComponent,
    CommentComponent,
    ViewPostComponent,
    EditPostComponent,
    NavbarComponent,
    FooterComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username = this.userService.getUsernameFromToken();
  tweetContent: string = '';
  publications: PublicationI[] = [];
  publicationUsernames: { [key: number]: string } = {};
  publicationProfileImages: { [key: number]: SafeUrl } = {};
  commentContent: string = '';
  currentPublication: PublicationI | null = null;
  currentUserId: number = 0;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private publicationsService: PublicationsService,
    private helperService: HelpersService,
    private commentsService: CommentsService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.userService.getUsuarioIdByUsername(this.username).subscribe(
      data => {
        this.helperService.setUserId(data);
        this.currentUserId = data;
        this.loadPublications(); 
      }
    );
    this.userService.getAllUsers().subscribe(
      data => console.log(data)
    );
  }

  isPublicationOwner(userId: number): boolean {
    return userId === this.currentUserId;
  }

  loadPublications(): void {
    this.publicationsService.getAllPublications().subscribe(
      data => {
        this.publications = data.map(publication => ({
          ...publication,
          liked_by_user: publication.likedBy.includes(this.currentUserId)
        }));
        this.publications = this.publications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.loadUsernamesAndImages();
      }
    );
  }

  loadUsernamesAndImages(): void {
    this.publications.forEach(publication => {
      this.userService.getUserById(publication.user_id).subscribe(user => {
        this.publicationUsernames[publication.id] = user.username;
        const profileImage = user.profileImageUrl ? this.sanitizeImageName(user.profileImageUrl) : '../../assets/img/profile.png';
        this.publicationProfileImages[publication.id] = this.sanitizeImageName(profileImage);
      });
    });
  }
  

  sanitizeImageName(name: string | SafeUrl): SafeUrl {
    if (typeof name !== 'string') {
      return name;
    }
    const fullUrl = name.startsWith('http') ? name : `http://localhost:8082/${decodeURIComponent(name)}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
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
    if (!this.tweetContent.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Write something plss!'
      });
      return;
    }
  
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
        this.loadPublications();
      },
      error => {
        console.error('Error creating publication:', error);
      }
    );
  }

  showCommentModal(publication: PublicationI): void {
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '500px',
      data: { 
        currentPublication: publication, 
        publicationUsername: this.publicationUsernames[publication.id],
        publicationProfileImage: this.publicationProfileImages[publication.id]
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
          this.loadPublications();
        },
        error => {
          console.error('Error creating comment:', error);
        }
      );
    }
  }

  viewPublication(publication: PublicationI, event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).tagName === 'I') {
      return;
    }

    const commentProfileImages: { [key: number]: SafeUrl } = {};

    publication.comments.forEach(comment => {
      this.userService.getUserById(comment.userId).subscribe(user => {
        commentProfileImages[comment.userId] = this.sanitizeImageName(user.profileImageUrl || '../../assets/img/profile.png');
      });
    });

    this.dialog.open(ViewPostComponent, {
      width: '500px',
      data: { 
        publication: publication, 
        publicationUsernames: this.publicationUsernames,
        publicationProfileImage: this.publicationProfileImages[publication.id],
        commentProfileImages: commentProfileImages
      }
    });
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

  toggleLike(publication: PublicationI): void {
    this.publicationsService.toggleLike(publication.id, this.currentUserId).subscribe(
      () => {
        console.log('Publication liked:', publication);
        publication.liked_by_user = !publication.liked_by_user;
        publication.vote_count += publication.liked_by_user ? 1 : -1;
      },
      error => {
        console.error('Error toggling like:', error);
      }
    );
  }
}

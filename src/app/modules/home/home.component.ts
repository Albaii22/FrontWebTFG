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
    // Fetches the user ID based on the username from the token
    this.userService.getUsuarioIdByUsername(this.username).subscribe(
      data => {
        // Sets the user ID in the helper service
        this.helperService.setUserId(data);
        // Assigns the user ID to the currentUserId variable
        this.currentUserId = data;
        // Loads publications once user ID is obtained
        this.loadPublications(); 
      }
    );
    // Fetches all users (for debugging purposes)
    this.userService.getAllUsers().subscribe(
      data => console.log(data)
    );
  }

  isPublicationOwner(userId: number): boolean {
    // Checks if the given user ID matches the current user's ID
    return userId === this.currentUserId;
  }

  loadPublications(): void {
    // Retrieves all publications from the service
    this.publicationsService.getAllPublications().subscribe(
      data => {
        // Maps each publication and checks if the current user liked it
        this.publications = data.map(publication => ({
          ...publication,
          liked_by_user: publication.likedBy.includes(this.currentUserId)
        }));
        // Sorts publications based on timestamp in descending order
        this.publications = this.publications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        // Loads usernames and profile images after retrieving publications
        this.loadUsernamesAndImages();
      }
    );
  }

  loadUsernamesAndImages(): void {
    // Iterates over each publication to fetch user details
    this.publications.forEach(publication => {
      this.userService.getUserById(publication.user_id).subscribe(user => {
        // Maps publication ID to the username of the user who made the publication
        this.publicationUsernames[publication.id] = user.username;
        // Retrieves the profile image URL and sanitizes it
        const profileImage = user.profileImageUrl ? this.sanitizeImageName(user.profileImageUrl) : '../../assets/img/profile.png';
        // Maps publication ID to the sanitized profile image URL
        this.publicationProfileImages[publication.id] = this.sanitizeImageName(profileImage);
      });
    });
  }
  

  sanitizeImageName(name: string | SafeUrl): SafeUrl {
    // Sanitizes the given image name or URL to prevent XSS attacks
    if (typeof name !== 'string') {
      return name;
    }
    // Constructs the full URL if not already provided
    const fullUrl = name.startsWith('http') ? name : `http://localhost:8082/${decodeURIComponent(name)}`;
    // Bypasses security to trust the generated URL
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }

  showNewPostModal(): void {
    // Opens a modal dialog for creating a new post
    const dialogRef = this.dialog.open(NewPostComponent, {
      width: '500px',
      // Passes data to the modal for prefilling the tweet content
      data: { tweetContent: this.tweetContent }
    });

    // Subscribes to the result of the modal dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Updates the tweet content with the result and creates a new publication
        this.tweetContent = result;
        this.createPublication();
      }
    });
  }

  createPublication(): void {
    // Checks if the tweet content is empty
    if (!this.tweetContent.trim()) {
      // Shows an error message using Swal if tweet content is empty
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Write something plss!' // Prompting the user to write something
      });
      return;
    }
  
    // Constructs a new publication object
    const newPublication: PublicationI = {
      id: 0,
      user_id: this.helperService.getUserId(), // Assigning the user ID to the publication
      content: this.tweetContent, // Assigning the tweet content to the publication
      vote_count: 0, // Initializing vote count to zero
      timestamp: new Date().toISOString(), // Assigning current timestamp to the publication
      comments: [], // Initializing comments array
      liked_by_user: false, // Initializing liked_by_user flag to false
      likedBy: [] // Initializing likedBy array
    };
  
    // Calls the publications service to create a new publication
    this.publicationsService.createPublication(newPublication, this.helperService.getUserId()).subscribe(
      response => {
        console.log('Publication created:', response); // Logging the response
        this.tweetContent = ''; // Clearing the tweet content after successful publication
        this.loadPublications(); // Reloads publications after creating a new one
      },
      error => {
        console.error('Error creating publication:', error); // Logging any error occurred during publication creation
      }
    );
  }

  showCommentModal(publication: PublicationI): void {
    // Opens a modal dialog for creating a new comment
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '500px',
      data: { 
        // Passing data to the modal including the current publication, its username, and profile image
        currentPublication: publication, 
        publicationUsername: this.publicationUsernames[publication.id],
        publicationProfileImage: this.publicationProfileImages[publication.id]
      }
    });

    // Subscribes to the result of the modal dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Sets the comment content to the result and creates a new comment
        this.commentContent = result;
        this.currentPublication = publication;
        this.createComment();
      }
    });
  }

  createComment(): void {
    if (this.currentPublication) {
      // Constructs a new comment object
      const newComment: CommentsI = {
        content: this.commentContent, // Assigning the comment content
        timestamp: new Date().toISOString(), // Assigning current timestamp to the comment
        publicationId: this.currentPublication.id, // Assigning the publication ID to the comment
        userId: this.helperService.getUserId(), // Assigning the user ID to the comment
      };

      // Calls the comments service to create a new comment
      this.commentsService.createComment(newComment, this.helperService.getUserId()).subscribe(
        response => {
          console.log('Comment created:', response); // Logging the response
          this.commentContent = ''; // Clearing the comment content after successful creation
          this.loadPublications(); // Reloads publications after creating a new comment
        },
        error => {
          console.error('Error creating comment:', error); // Logging any error occurred during comment creation
        }
      );
    }
  }

  viewPublication(publication: PublicationI, event: MouseEvent): void {
    // Checks if the clicked element is not a button or an icon (to avoid unintentional navigation)
    if ((event.target as HTMLElement).tagName === 'BUTTON' || (event.target as HTMLElement).tagName === 'I') {
      return;
    }

    // Object to store profile images of commenters
    const commentProfileImages: { [key: number]: SafeUrl } = {};

    // Iterates over each comment in the publication
    publication.comments.forEach(comment => {
      // Fetches the user details for each comment
      this.userService.getUserById(comment.userId).subscribe(user => {
        // Sanitizes and stores the profile image URL for each commenter
        commentProfileImages[comment.userId] = this.sanitizeImageName(user.profileImageUrl || '../../assets/img/profile.png');
      });
    });

    // Opens a modal dialog to view the publication with its comments
    this.dialog.open(ViewPostComponent, {
      width: '500px',
      data: { 
        // Passing data to the modal including the publication, its usernames, and profile images
        publication: publication, 
        publicationUsernames: this.publicationUsernames,
        publicationProfileImage: this.publicationProfileImages[publication.id],
        commentProfileImages: commentProfileImages
      }
    });
  }


  getTimeSince(timestamp: string): string {
    // Calculates the time difference between the current time and the publication timestamp
    const now = new Date();
    const publicationDate = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - publicationDate.getTime()) / 1000);

    // Converts the time difference into years, months, days, hours, minutes, or seconds
    let interval = seconds / 31536000; // Number of seconds in a year
    if (interval > 1) return Math.floor(interval) + ' years';

    interval = seconds / 2592000; // Number of seconds in a month
    if (interval > 1) return Math.floor(interval) + ' months';

    interval = seconds / 86400; // Number of seconds in a day
    if (interval > 1) return Math.floor(interval) + ' days';

    interval = seconds / 3600; // Number of seconds in an hour
    if (interval > 1) return Math.floor(interval) + ' hours';

    interval = seconds / 60; // Number of seconds in a minute
    if (interval > 1) return Math.floor(interval) + ' minutes';

    return Math.floor(seconds) + ' seconds'; // Returns seconds if the time difference is less than a minute
}

navigateToProfile(): void {
    // Navigates to the profile page
    this.helperService.navigateTo('/profile');
}

navigateToHome(): void {
    // Navigates to the home page
    this.helperService.navigateTo('/home');
}

navigateToFollowing() {
    // Navigates to the following page
    this.helperService.navigateTo('/users');
}

confirmDeletePublication(publicationId: number): void {
    // Shows a confirmation dialog before deleting a publication
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
        // Calls the deletePublication method if the user confirms deletion
        this.deletePublication(publicationId);
        this.loadPublications();
      }
    });
}

deletePublication(publicationId: number): void {
    // Deletes a publication by its ID
    this.publicationsService.deletePublication(publicationId).subscribe(
      () => {
        // Shows a success message after successful deletion
        Swal.fire(
          'Deleted!',
          'Your publication has been deleted.',
          'success'
        );
        this.loadPublications(); // Reloads publications after deletion
      },
      error => {
        // Logs an error and shows an error message if deletion fails
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
    // Opens a modal dialog for editing a publication
    const dialogRef = this.dialog.open(EditPostComponent, {
      width: '500px',
      data: { publication: publication } // Passes the publication data to the modal
    });

    // Subscribes to the result of the modal dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Calls the updatePublication method with the updated content if result is not null
        this.updatePublication(publication.id, result);
      }
    });
}


updatePublication(publicationId: number, newContent: string): void {
  // Constructs an updated publication object with the new content
  const updatedPublication: PublicationI = { ...this.publications.find(pub => pub.id === publicationId), content: newContent } as PublicationI;

  // Calls the publications service to update the publication
  this.publicationsService.updatePublication(publicationId, updatedPublication).subscribe(
    () => {
      // Shows a success message after successful update
      Swal.fire(
        'Updated!',
        'Your publication has been updated.',
        'success'
      );
      this.loadPublications(); // Reloads publications after updating
    },
    error => {
      // Logs an error and shows an error message if update fails
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
  // Toggles the like status of a publication
  this.publicationsService.toggleLike(publication.id, this.currentUserId).subscribe(
    () => {
      console.log('Publication liked:', publication); // Logs the publication after liking/unliking
      // Updates the like status and vote count of the publication
      publication.liked_by_user = !publication.liked_by_user;
      publication.vote_count += publication.liked_by_user ? 1 : -1;
    },
    error => {
      console.error('Error toggling like:', error); // Logs an error if toggling like fails
    }
  );
}

}

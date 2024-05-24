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
  // Initialize variables
tweetContent: string = '';
username = this.userService.getUsernameFromToken(); // Get the username from the token
users: userI[] = []; // Array to store users
selectedUser: userI | null = null; // Currently selected user
selectedUserPublications: PublicationI[] = []; // Publications of the selected user
currentUserId: number = 0; // ID of the current user
commentContent: string = ''; // Content of the comment
currentPublication: PublicationI | null = null; // Currently selected publication
isCurrentUserProfile: boolean = false; // Flag to indicate if the current user is viewing their own profile

constructor(
  private router: Router,
  private helperService: HelpersService,
  private publicationsService: PublicationsService,
  private userService: UserService,
  private commentsService: CommentsService,
  private dialog: MatDialog,
  private sanitizer: DomSanitizer // Sanitizer to bypass security for URLs
) {}

// Lifecycle hook called after component initialization
ngOnInit(): void {
  // Load users and fetch current user's ID
  this.loadUsers();
  this.userService.getUsuarioIdByUsername(this.username).subscribe(
    data => {
      this.currentUserId = data; // Store the current user's ID
      console.log(this.currentUserId);
    },
    error => {
      console.error('Error fetching user id:', error);
    }
  );
}

// Method to load all users
loadUsers(): void {
  this.userService.getAllUsers().subscribe(
    users => {
      // Map users and update profile image URLs
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


  // Method to sanitize an image URL to make it safe for display
sanitizeImageUrl(url: string): SafeUrl {
  return this.sanitizer.bypassSecurityTrustUrl(url);
}

// Method to navigate to the following page
navigateToFollowing() {
  this.helperService.navigateTo('/users');
}

// Method to navigate to the profile page
navigateToProfile(): void {
  this.helperService.navigateTo('/profile');
}

// Method to navigate to the home page
navigateToHome(): void {
  this.helperService.navigateTo('/home');
}

// Method to display the new post modal
showNewPostModal(): void {
  // Open the new post dialog and listen for changes
  const dialogRef = this.dialog.open(NewPostComponent, {
    width: '500px',
    data: { tweetContent: this.tweetContent }
  });

  dialogRef.afterClosed().subscribe(result => {
    // If the result is not empty, create a new publication
    if (result) {
      this.tweetContent = result;
      this.createPublication();
    }
  });
}

// Method to create a new publication
createPublication(): void {
  // Create a new publication object with provided content and current user's ID
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

  // Send a request to create the publication
  this.publicationsService.createPublication(newPublication, this.helperService.getUserId()).subscribe(
    response => {
      // Log success message and reset tweet content
      console.log('Publication created:', response);
      this.tweetContent = '';
      
      // If a user is selected and it's the current user's profile, reload the user's publications
      if (this.selectedUser && this.selectedUser.id === this.currentUserId) {
        this.loadUserPublications(this.currentUserId);
      }
    },
    error => {
      // Handle error if publication creation fails
      console.error('Error creating publication:', error);
    }
  );
}


  // Method to view the profile of a user
viewUserProfile(user: userI): void {
  // Set the selected user, determine if it's the current user's profile, and load the user's publications
  this.selectedUser = user;
  this.isCurrentUserProfile = (user.id === this.currentUserId);
  this.loadUserPublications(user.id);
}

// Method to load publications of a specific user
loadUserPublications(userId: number): void {
  // Retrieve publications of the specified user from the server
  this.publicationsService.getPublicationsByUserId(userId).subscribe(
    publications => {
      // Map each publication and set whether the current user has liked them, then sort them by timestamp
      this.selectedUserPublications = publications.map(publication => ({
        ...publication,
        liked_by_user: publication.likedBy.includes(this.currentUserId)
      })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    error => {
      // Handle error if fetching user publications fails
      console.error('Error fetching user publications:', error);
    }
  );
}

// Method to close the selected user's profile view
closeUserProfile(): void {
  // Reset selected user and their publications
  this.selectedUser = null;
  this.selectedUserPublications = [];
}

// Method to calculate the time since a given timestamp
getTimeSince(timestamp: string): string {
  // Calculate time difference between current time and the timestamp
  const now = new Date();
  const publicationDate = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - publicationDate.getTime()) / 1000);

  // Determine the appropriate time unit to display
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes';

  return Math.floor(seconds) + ' seconds';
}

// Method to edit a publication
editPublication(publication: PublicationI): void {
  // Open the edit post dialog and listen for changes
  const dialogRef = this.dialog.open(EditPostComponent, {
    width: '500px',
    data: { publication: publication }
  });

  dialogRef.afterClosed().subscribe(result => {
    // If the result is not empty, update the publication
    if (result) {
      this.updatePublication(publication.id, result);
    }
  });
}


  // Method to update a publication with new content
updatePublication(publicationId: number, newContent: string): void {
  // Find the publication to be updated in the list of selected user publications and create an updatedPublication object with the new content
  const updatedPublication: PublicationI = { ...this.selectedUserPublications.find(pub => pub.id === publicationId), content: newContent } as PublicationI;

  // Send a request to the server to update the publication
  this.publicationsService.updatePublication(publicationId, updatedPublication).subscribe(
    () => {
      // If the update is successful, display a success message to the user
      Swal.fire(
        'Updated!',
        'Your publication has been updated.',
        'success'
      );
      // Reload the user publications after the update
      this.loadUserPublications(this.selectedUser?.id || this.currentUserId);
    },
    error => {
      // If an error occurs during the update process, log the error and display an error message to the user
      console.error('Error updating publication:', error);
      Swal.fire(
        'Error!',
        'There was an error updating your publication.',
        'error'
      );
    }
  );
}

// Method to confirm deletion of a publication
confirmDeletePublication(publicationId: number): void {
  // Display a confirmation dialog to the user before proceeding with the deletion
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    // If the user confirms the deletion, proceed with deleting the publication
    if (result.isConfirmed) {
      this.deletePublication(publicationId);
    }
  });
}

// Method to delete a publication
deletePublication(publicationId: number): void {
  // Send a request to the server to delete the publication
  this.publicationsService.deletePublication(publicationId).subscribe(
    () => {
      // If the deletion is successful, display a success message to the user
      Swal.fire(
        'Deleted!',
        'Your publication has been deleted.',
        'success'
      );
      // Reload the user publications after the deletion
      this.loadUserPublications(this.selectedUser?.id || this.currentUserId);
    },
    error => {
      // If an error occurs during the deletion process, log the error and display an error message to the user
      console.error('Error deleting publication:', error);
      Swal.fire(
        'Error!',
        'There was an error deleting your publication.',
        'error'
      );
    }
  );
}


 // Method to open the comment modal for a specific publication
showCommentModal(publication: PublicationI): void {
  // Open a dialog to display the comment component
  const dialogRef = this.dialog.open(CommentComponent, {
    width: '500px',
    data: { 
      currentPublication: publication, // Pass the current publication to the modal
      publicationUsername: this.selectedUser?.username // Pass the username of the selected user (if available)
    }
  });

  // Subscribe to the dialog closing event
  dialogRef.afterClosed().subscribe(result => {
    // If a result is received (i.e., a comment was submitted)
    if (result) {
      // Set the comment content to the result
      this.commentContent = result;
      // Set the current publication to the one being commented on
      this.currentPublication = publication;
      // Create the comment
      this.createComment();
    }
  });
}

// Method to create a new comment
createComment(): void {
  // Check if there is a current publication
  if (this.currentPublication) {
    // Create a new comment object
    const newComment: CommentsI = {
      content: this.commentContent,                           // Set the content of the comment
      timestamp: new Date().toISOString(),                    // Set the timestamp to the current time
      publicationId: this.currentPublication.id,              // Set the publication ID of the comment
      userId: this.helperService.getUserId(),                // Set the user ID of the comment creator
    };

    // Send a request to the server to create the comment
    this.commentsService.createComment(newComment, this.helperService.getUserId()).subscribe(
      response => {
        console.log('Comment created:', response);            // Log the successful creation of the comment
        this.commentContent = '';                             // Clear the comment content
        this.loadUserPublications(this.selectedUser?.id || this.currentUserId); // Reload user publications
      },
      error => {
        console.error('Error creating comment:', error);      // Log any errors that occur during comment creation
      }
    );
  }
}

// Method to toggle the like status of a publication
toggleLike(publication: PublicationI): void {
  // Send a request to the server to toggle the like status of the publication
  this.publicationsService.toggleLike(publication.id, this.currentUserId).subscribe(
    () => {
      // Update the like status and vote count of the publication based on the server response
      publication.liked_by_user = !publication.liked_by_user;
      publication.vote_count += publication.liked_by_user ? 1 : -1;
    },
    error => {
      console.error('Error toggling like:', error);  // Log any errors that occur during the like toggling process
    }
  );
}

}

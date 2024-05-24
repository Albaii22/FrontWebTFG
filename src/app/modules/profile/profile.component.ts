import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef; // ViewChild decorator for file input element

  username = this.userService.getUsernameFromToken(); // Current username retrieved from token
  tweetContent = ''; // Content of a tweet
  userPublications: PublicationI[] = []; // Array to store user's publications
  registrationDate: Date = new Date(); // Registration date of the user
  profileImageUrl: SafeUrl | string = '../../assets/img/profile.png'; // URL of the user's profile image
  aboutMe: string = ''; // User's about me information
  commentContent: string = ''; // Content of a comment
  currentPublication: PublicationI | null = null; // Current publication being viewed
  currentUserId: number = 0; // Current user's ID
  userId = this.helperService.getUserId(); // Current user's ID retrieved from the helper service
  selectedFile: File | null = null; // Selected file for profile image update

  constructor(
    private userService: UserService, // Injecting UserService for user-related operations
    private helperService: HelpersService, // Injecting HelpersService for helper functions
    private publicationsService: PublicationsService, // Injecting PublicationsService for publication-related operations
    private dialog: MatDialog, // Injecting MatDialog for dialog functionality
    private commentsService: CommentsService, // Injecting CommentsService for comment-related operations
    private tokenService: TokenService, // Injecting TokenService for token-related operations
    private sanitizer: DomSanitizer, // Injecting DomSanitizer for sanitizing URLs
    private renderer: Renderer2 // Injecting Renderer2 for DOM manipulation
  ) {}

  ngOnInit(): void {
    // Function called when the component is initialized
    this.userService.getUsuarioIdByUsername(this.username).subscribe(
      user => {
        this.helperService.setUserId(user); // Setting the current user's ID in the helper service
        if (user.profileImageUrl) {
          this.profileImageUrl = this.sanitizeImageName(user.profileImageUrl); // Sanitizing the user's profile image URL
        }
        this.currentUserId = user; // Setting the current user's ID
        this.loadUserPublications(); // Loading user's publications
      },
      error => {
        console.error('Error fetching user id data:', error); // Logging error message if user ID data fetch fails
      }
    );

    this.userService.getUserById(this.helperService.getUserId()).subscribe(
      user => {
        this.registrationDate = new Date(user.registration_date); // Setting user's registration date
        this.aboutMe = user.aboutMe; // Setting user's about me information
        if (user.profileImageUrl) {
          this.profileImageUrl = this.sanitizeImageName(user.profileImageUrl); // Sanitizing the user's profile image URL
        }
      },
      error => {
        console.error('Error fetching user data:', error); // Logging error message if user data fetch fails
      }
    );

    console.log(this.helperService.getUserId()); // Logging the current user's ID retrieved from the helper service
  }

  sanitizeImageName(name: string): SafeUrl {
    // Function to sanitize image name and return SafeUrl
    const fullUrl = `http://localhost:8082/${decodeURIComponent(name)}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }

  onFileSelected(event: any): void {
    // Function called when a file is selected
    const file = event.target.files[0]; // Retrieving the selected file
    if (file) {
      this.selectedFile = file; // Setting the selected file
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)); // Sanitizing the profile image URL
      this.onUpload(); // Uploading the selected file
    }
  }

  onUpload(): void {
    // Function to handle profile image upload
    if (this.selectedFile && this.userId !== null) {
      // If a file is selected and user ID is available
      this.userService.uploadProfileImage(this.userId, this.selectedFile).subscribe(
        (response: { profileImageUrl: string }) => {
          // Subscribing to the uploadProfileImage method
          // Updating the profile image URL after successful upload
          this.profileImageUrl = this.sanitizeImageName(response.profileImageUrl);
          console.log('Image uploaded successfully', response);
          console.log('Profile Image URL:', response.profileImageUrl);
        },
        error => {
          // Handling error if image upload fails
          console.error('Error uploading image', error);
        }
      );
    }
  }
  
  selectFileInput(): void {
    // Function to programmatically click the file input element
    this.renderer.selectRootElement(this.fileInput.nativeElement).click();
  }
  
  showNewPostModal(): void {
    // Function to show the new post modal dialog
    const dialogRef = this.dialog.open(NewPostComponent, {
      width: '500px',
      data: { tweetContent: this.tweetContent }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Subscribing to the dialog closing event
      if (result) {
        this.tweetContent = result;
        this.createPublication(); // Creating a new publication
        window.location.reload(); // Reloading the window to reflect changes
      }
    });
  }

  createPublication(): void {
    // Function to create a new publication
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
  
    // Subscribing to the createPublication method
    this.publicationsService.createPublication(newPublication, this.helperService.getUserId()).subscribe(
      response => {
        // Handling successful publication creation
        console.log('Publication created:', response);
        this.tweetContent = ''; // Clearing the tweet content after successful publication
      },
      error => {
        // Handling error if publication creation fails
        console.error('Error creating publication:', error);
      }
    );
  }
  
  loadUserPublications(): void {
    // Function to load user publications
    const userId = this.helperService.getUserId(); // Getting the user ID
    if (userId) {
      // If user ID is defined
      this.publicationsService.getPublicationsByUserId(userId).subscribe(
        publications => {
          // Subscribing to getPublicationsByUserId method
          console.log('Publications:', publications); // Logging the publications
          // Mapping and sorting the publications based on timestamp
          this.userPublications = publications
            .map(publication => ({
              ...publication,
              liked_by_user: publication.likedBy.includes(this.currentUserId)
            }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        },
        error => {
          // Handling error if fetching user publications fails
          console.error('Error fetching user publications:', error);
        }
      );
    } else {
      // If user ID is undefined
      console.error('User ID is undefined');
    }
  }
  
  navigateToProfile(): void {
    // Function to navigate to the user profile
    this.helperService.navigateTo('/profile');
  }
  navigateToHome(): void {
    // Function to navigate to the home page
    this.helperService.navigateTo('/home');
  }
  
  navigateToFollowing(): void {
    // Function to navigate to the following page
    this.helperService.navigateTo('/users');
  }
  
  getTimeSince(timestamp: string): string {
    // Function to calculate time elapsed since a given timestamp
    const now = new Date(); // Current date and time
    const publicationDate = new Date(timestamp); // Timestamp of the publication
    const seconds = Math.floor((now.getTime() - publicationDate.getTime()) / 1000); // Time difference in seconds
  
    let interval = seconds / 31536000; // Interval in years
    if (interval > 1) return Math.floor(interval) + ' años'; // Return years if interval is greater than 1
  
    interval = seconds / 2592000; // Interval in months
    if (interval > 1) return Math.floor(interval) + ' meses'; // Return months if interval is greater than 1
  
    interval = seconds / 86400; // Interval in days
    if (interval > 1) return Math.floor(interval) + ' días'; // Return days if interval is greater than 1
  
    interval = seconds / 3600; // Interval in hours
    if (interval > 1) return Math.floor(interval) + ' horas'; // Return hours if interval is greater than 1
  
    interval = seconds / 60; // Interval in minutes
    if (interval > 1) return Math.floor(interval) + ' minutos'; // Return minutes if interval is greater than 1
  
    return Math.floor(seconds) + ' segundos'; // Return seconds
  }
  
  confirmDeletePublication(publicationId: number): void {
    // Function to confirm deletion of a publication
    Swal.fire({
      title: 'Are you sure?', // Confirmation message
      text: 'You won\'t be able to revert this!', // Explanation
      icon: 'warning', // Warning icon
      showCancelButton: true, // Show cancel button
      confirmButtonColor: '#d33', // Confirm button color
      cancelButtonColor: '#3085d6', // Cancel button color
      confirmButtonText: 'Yes, delete it!' // Confirm button text
    }).then((result) => {
      // Action based on user's choice
      if (result.isConfirmed) {
        // If user confirms deletion
        this.deletePublication(publicationId); // Delete the publication
        this.loadUserPublications(); // Reload user publications
      }
    });
  }

  deletePublication(publicationId: number): void {
    // Function to delete a publication
    this.publicationsService.deletePublication(publicationId).subscribe(
      () => {
        // If deletion is successful
        Swal.fire( // Show success message
          'Deleted!', // Title
          'Your publication has been deleted.', // Message
          'success' // Success icon
        );
        this.loadUserPublications(); // Reload user publications
      },
      error => {
        // If there's an error during deletion
        console.error('Error deleting publication:', error); // Log the error
        Swal.fire( // Show error message
          'Error!', // Title
          'There was an error deleting your publication.', // Message
          'error' // Error icon
        );
      }
    );
  }
  
  editPublication(publication: PublicationI): void {
    // Function to open the edit publication dialog
    const dialogRef = this.dialog.open(EditPostComponent, {
      width: '500px', // Dialog width
      data: { publication: publication } // Data passed to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Action after the dialog is closed
      if (result) {
        // If there's a result (content updated)
        this.updatePublication(publication.id, result); // Update the publication
      }
    });
  }
  
  updatePublication(publicationId: number, newContent: string): void {
    // Function to update a publication
    const updatedPublication: PublicationI = {
      ...this.userPublications.find(pub => pub.id === publicationId), // Find the publication to update
      content: newContent // Update the content
    } as PublicationI;
  
    this.publicationsService.updatePublication(publicationId, updatedPublication).subscribe(
      () => {
        // If update is successful
        Swal.fire( // Show success message
          'Updated!', // Title
          'Your publication has been updated.', // Message
          'success' // Success icon
        );
        this.loadUserPublications(); // Reload user publications
      },
      error => {
        // If there's an error during update
        console.error('Error updating publication:', error); // Log the error
        Swal.fire( // Show error message
          'Error!', // Title
          'There was an error updating your publication.', // Message
          'error' // Error icon
        );
      }
    );
  }
  
  editProfile(): void {
    // Function to open the edit profile dialog
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '500px', // Dialog width
      data: {
        username: this.username, // Pass current username
        aboutMe: this.aboutMe, // Pass current about me
        profileImageUrl: this.profileImageUrl // Pass current profile image URL
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Action after the dialog is closed
      if (result) {
        // If there's a result (profile updated)
        const { username, aboutMe, profileImageUrl } = result; // Destructure the result
        const updatedUser: userUpdateI = { // Prepare the updated user object
          username,
          aboutMe,
          profileImageUrl: profileImageUrl
        };
  
        this.userService.updateUsuario(this.helperService.getUserId(), updatedUser).subscribe(
          () => {
            // If update is successful
            Swal.fire( // Show success message
              'Updated!', // Title
              'Your profile has been updated. Log In again.', // Message
              'success' // Success icon
            );
            this.username = username; // Update the local username
            this.aboutMe = aboutMe; // Update the local about me
            this.profileImageUrl = this.sanitizeImageName(profileImageUrl); // Update the local profile image URL
            this.helperService.navigateTo('/login'); // Navigate to login page
            this.tokenService.removeToken(); // Remove token
          },
          error => {
            // If there's an error during update
            console.error('Error updating profile:', error); // Log the error
            Swal.fire( // Show error message
              'Error!', // Title
              'There was an error updating your profile.', // Message
              'error' // Error icon
            );
          }
        );
      }
    });
  }
  
  showCommentModal(publication: PublicationI): void {
    // Function to open the comment modal
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '500px', // Dialog width
      data: {
        currentPublication: publication, // Pass the current publication
        publicationUsername: this.username // Pass the current username
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Action after the dialog is closed
      if (result) {
        this.commentContent = result; // Update the comment content
        this.currentPublication = publication; // Update the current publication
        this.createComment(); // Create the comment
      }
    });
  }
  
  createComment(): void {
    // Function to create a comment
    if (this.currentPublication) { // Check if there's a current publication
      const newComment: CommentsI = { // Prepare the new comment object
        content: this.commentContent,
        timestamp: new Date().toISOString(),
        publicationId: this.currentPublication.id,
        userId: this.helperService.getUserId()
      };
  
      this.commentsService.createComment(newComment, this.helperService.getUserId()).subscribe(
        response => {
          // If comment creation is successful
          console.log('Comment created:', response); // Log the success message
          this.commentContent = ''; // Reset the comment content
          this.loadUserPublications(); // Reload user publications
        },
        error => {
          // If there's an error during comment creation
          console.error('Error creating comment:', error); // Log the error
        }
      );
    }
  }
  

  toggleLike(publication: PublicationI): void {
    // Function to toggle like on a publication
    this.publicationsService.toggleLike(publication.id, this.currentUserId).subscribe(
      () => {
        // If like is toggled successfully
        publication.liked_by_user = !publication.liked_by_user; // Toggle liked_by_user flag
        publication.vote_count += publication.liked_by_user ? 1 : -1; // Increment or decrement vote count based on like toggle
      },
      error => {
        // If there's an error during like toggle
        console.error('Error toggling like:', error); // Log the error
      }
    );
  }
  
  viewPublication(publication: PublicationI, event: MouseEvent): void {
    // Function to view a publication
    if (
      (event.target as HTMLElement).tagName === 'BUTTON' || // Check if the clicked element is a button
      (event.target as HTMLElement).tagName === 'I' // Check if the clicked element is an icon
    ) {
      return; // If so, return without opening the dialog
    }
  
    this.dialog.open(ViewPostComponent, { // Open the ViewPostComponent dialog
      width: '500px', // Dialog width
      data: { 
        publication: publication, // Pass the publication data
        publicationUsernames: { [publication.id]: this.username } // Pass the current username
      }
    });
  }
  
}

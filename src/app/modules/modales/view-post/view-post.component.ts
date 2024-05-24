import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PublicationI } from '../../../interfaces/publications.interface';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-post',
  standalone: true,
  templateUrl: './view-post.component.html',
  imports: [FormsModule, NgFor],
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent {
  publication: PublicationI; // Variable to store the publication data
  publicationUsernames: { [key: number]: string }; // Object to store publication usernames
  publicationProfileImage: SafeUrl; // SafeUrl to store the publication profile image
  commentProfileImages: { [key: number]: SafeUrl }; // Object to store comment profile images

  constructor(
    public dialogRef: MatDialogRef<ViewPostComponent>, // Injecting MatDialogRef for dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any, // Injecting MAT_DIALOG_DATA for passing data to the dialog
    private sanitizer: DomSanitizer // Injecting DomSanitizer for sanitizing URLs
  ) {
    this.publication = data.publication; // Assigning publication data from injected data
    this.publicationUsernames = data.publicationUsernames; // Assigning publication usernames from injected data
    this.publicationProfileImage = this.sanitizeImageName(data.publicationProfileImage); // Sanitizing publication profile image URL
    this.commentProfileImages = data.commentProfileImages || {}; // Assigning comment profile images from injected data or an empty object
  }

  // Closing the dialog without any action
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Function to calculate and return time elapsed since a timestamp
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

  // Function to sanitize image name and return SafeUrl
  sanitizeImageName(name: string | SafeUrl): SafeUrl {
    if (typeof name !== 'string') {
      return name; 
    }
    const fullUrl = name.startsWith('http') ? name : `http://localhost:8082/${decodeURIComponent(name)}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }
}

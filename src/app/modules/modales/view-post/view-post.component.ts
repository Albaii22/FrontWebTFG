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
  publication: PublicationI;
  publicationUsernames: { [key: number]: string };
  publicationProfileImage: SafeUrl;
  commentProfileImages: { [key: number]: SafeUrl };

  constructor(
    public dialogRef: MatDialogRef<ViewPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.publication = data.publication;
    this.publicationUsernames = data.publicationUsernames;
    this.publicationProfileImage = this.sanitizeImageName(data.publicationProfileImage);
    this.commentProfileImages = data.commentProfileImages || {};
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  sanitizeImageName(name: string | SafeUrl): SafeUrl {
    if (typeof name !== 'string') {
      return name; // Si ya es un SafeUrl, devuélvelo directamente
    }
    const fullUrl = name.startsWith('http') ? name : `http://localhost:8082/${decodeURIComponent(name)}`;
    return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
  }
}

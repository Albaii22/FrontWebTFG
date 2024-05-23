import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PublicationI } from '../../../interfaces/publications.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  templateUrl: './edit-post.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {
  publication: PublicationI;
  updatedContent: string;

  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.publication = data.publication;
    this.updatedContent = this.publication.content;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    this.dialogRef.close(this.updatedContent);
  }
}

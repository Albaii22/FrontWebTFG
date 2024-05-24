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
  publication: PublicationI; // Variable to store the publication data
  updatedContent: string; // Variable to store the updated content of the publication

  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>, // Injecting MatDialogRef for dialog reference
    @Inject(MAT_DIALOG_DATA) public data: any // Injecting MAT_DIALOG_DATA for passing data to the dialog
  ) {
    // Initializing component properties with data passed to the dialog
    this.publication = data.publication;
    this.updatedContent = this.publication.content;
  }

  onNoClick(): void {
    this.dialogRef.close(); // Closing the dialog without any action
  }

  saveChanges(): void {
    this.dialogRef.close(this.updatedContent); // Closing the dialog and passing the updated content
  }
}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PublicationI } from '../../../interfaces/publications.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  templateUrl: './edit-post.component.html',
  imports: [FormsModule],
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent {
  publication: PublicationI;

  constructor(
    public dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.publication = data.publication;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updatePublication(): void {
    this.dialogRef.close(this.publication.content);
  }
}

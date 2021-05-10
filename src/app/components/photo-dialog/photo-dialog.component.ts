import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-photo-dialog',
  templateUrl: './photo-dialog.component.html',
  styleUrls: ['./photo-dialog.component.scss']
})
export class PhotoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Photo,
    public dialogRef: MatDialogRef<PhotoDialogComponent>
  ) {}
}

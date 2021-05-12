import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-photo-dialog',
  templateUrl: './photo-dialog.component.html',
  styleUrls: ['./photo-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoDialogComponent {
  public hasOpened$: Observable<boolean>
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Photo,
    public dialogRef: MatDialogRef<PhotoDialogComponent>
  ) {
    this.hasOpened$ = this.dialogRef.afterOpened().pipe(mapTo(true));
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
  @Input() photo: Photo;
  @Input() size: 'gallery' | 'expanded' = 'gallery' 
  @Output() onPhotoClick = new EventEmitter<Photo>();

  public onPhotoClicked() {
    this.onPhotoClick.emit(this.photo)
  }
}

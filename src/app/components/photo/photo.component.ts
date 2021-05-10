import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PexelsPhoto, Photo } from 'src/app/models';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  public urlProperty: 'galleryUrl' | 'expandedUrl' = 'galleryUrl';

  @Input() photo: Photo;
  @Input('size') set urlSizeToDisplay(size: 'gallery' | 'expanded') {
    this.urlProperty = `${size}Url` as any;
  };

  @Output() onPhotoClick = new EventEmitter<Photo>();
  
  constructor() { }

  ngOnInit(): void {
  }

  public onPhotoClicked() {
    this.onPhotoClick.emit(this.photo)
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PexelsPhoto } from 'src/app/models';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  public photo: PexelsPhoto;

  @Input('photo') set _photo(photo: PexelsPhoto) {
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(<string>photo.src.medium);
    this.photo = { ...photo, url: sanitizedUrl }
  };

  @Output() onPhotoClick = new EventEmitter<PexelsPhoto>();
  
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  public onPhotoClicked() {
    this.onPhotoClick.emit(this.photo)
  }
}

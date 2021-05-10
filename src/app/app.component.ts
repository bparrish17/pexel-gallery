import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { PhotoDialogComponent } from './components/photo-dialog/photo-dialog.component';
import { PexelsPhoto, Photo } from './models';
import { PexelsService } from './services/pexels.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public photos$: Observable<Photo[]>;
  public photosSubject$ = new BehaviorSubject<string>('city');

  constructor(private pexelsService: PexelsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.photos$ = this.photosSubject$.pipe(
      debounceTime(300),
      tap(console.log),
      switchMap((query: string) => this.pexelsService.searchImages(query))
    )
  }

  public onSearchInputted(query: string) {
    console.log('query', query);
    this.photosSubject$.next(query);
  }

  public onPhotoClicked(photo: PexelsPhoto) {
    const { width, height } = this.calculateMaxPhotoDimensions(photo);
    this.dialog.open(PhotoDialogComponent, { width, height, data: photo });
  }

  /**
   * Calculates the pixel size for fitting the photo as large as possible into 
   * 90% of the window
   * @param photo {PexelsPhoto} : Photo to calculate fit for
   * @returns { width: string; height: string } : dimensions
   */
  public calculateMaxPhotoDimensions(photo: PexelsPhoto): { width: string; height: string } {
    const windowWidth = window.innerWidth * 0.90;
    const windowHeight = window.innerHeight * 0.90;
    const scale = Math.min(windowWidth/photo.width, windowHeight/photo.height);
    const calcPixelValue = (val: number) => `${val * scale}px`;
    return {
      width: calcPixelValue(photo.width),
      height: calcPixelValue(photo.height)
    };
  }
}

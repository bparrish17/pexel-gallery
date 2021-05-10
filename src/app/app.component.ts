import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, filter, first, mergeMap, switchMap, tap } from 'rxjs/operators';
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
  public download: any;

  @ViewChild('downloadRef', { static: false }) downloadRef: ElementRef; 

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
    const { width, height } = this._calculateMaxPhotoDimensions(photo);
    this._openPhotoDialog(width, height, photo).pipe(
      first(),
      mergeMap(() => this.pexelsService.getDownloadablePhotoUrl(photo.src.original))
    ).subscribe((downloadableUrl: string) => {
      const a = document.createElement("a");
      a.href = downloadableUrl
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  /**
   * Calculates the pixel size for fitting the photo as large as possible into 
   * 90% of the window
   * @param photo {PexelsPhoto} : Photo to calculate fit for
   * @returns { width: string; height: string } : dimensions
   */
  private _calculateMaxPhotoDimensions(photo: PexelsPhoto): { width: string; height: string } {
    const maxPercentOfWindow = 0.85;
    const windowWidth = window.innerWidth * maxPercentOfWindow;
    const windowHeight = window.innerHeight * maxPercentOfWindow;
    const scale = Math.min(windowWidth/photo.width, windowHeight/photo.height);
    const calcPixelValue = (val: number) => `${val * scale}px`;
    return {
      width: calcPixelValue(photo.width),
      height: `${photo.height * scale + 62}px`
    };
  }

  private _openPhotoDialog(width: string, height: string, photo: PexelsPhoto): Observable<boolean> {
    return this.dialog
      .open(PhotoDialogComponent, { width, height, data: photo })
      .afterClosed()
      .pipe(filter((dialogResult: boolean) => !!dialogResult))
  }
}

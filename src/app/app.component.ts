import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { debounceTime, delay, filter, map, mapTo, mergeMap, pairwise, switchMap, take, tap } from 'rxjs/operators';
import { PhotoDialogComponent } from './components/photo-dialog/photo-dialog.component';
import { GallerySection, PexelsPhoto, Photo } from './models';
import { PexelsService } from './services/pexels.service';

/*

Todos:
- Add top vs bottom offset to offset directive
- Unit tests
- Organize imports
  - Aliases in package.json
- Update "Photo" interface uses
- function documentation
- ARIA
- get consistent conventions with private _ in service injections
- have photo component support either gallery or expanded size
- "No Results" message
- Loading spinner

Edge Cases
- Changes in window height while searching
- 


Gallery Notes
- add observable property to 
- just have service call return full result with query

*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public photos$: Observable<Photo[]>;
  public photosSubject$ = new BehaviorSubject<string>('city');
  public latestResults: GallerySection[];
  public searchResults$: Observable<GallerySection[]>;
  public loading: boolean;

  constructor(
    private pexelsService: PexelsService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.searchResults$ = this._getSearchResults()
  }


  /**********************************************************
   * Template Actions
   **********************************************************/

  public onSearchInputted(query: string) {
    this.photosSubject$.next(query);
  }

  /**
   * Opens photo dialog and then downloads photo depending on result
   * @param photo : PexelsPhoto
   */
  public onPhotoClicked(photo: PexelsPhoto) {
    const { width, height } = this._calculateMaxPhotoDimensions(photo);
    this._openPhotoDialog(width, height, photo).pipe(
      take(1), // handle close at max once
      mergeMap(() => this.pexelsService.getDownloadablePhotoUrl(photo.src.original))
    ).subscribe((downloadableUrl: string) => {
      const a = document.createElement('a');
      a.href = downloadableUrl
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  /**********************************************************
   * Search Methods
   **********************************************************/

  /**
   * Merges search input and scroll events into single Observable stream
   * @returns {Observable<GallerySection[]>} Array of gallery sections to display
   * @description
   * - Turns on loading when a query has been made
   * - Debounces photoSubject$ by 300ms to prevent excessive API calls
   */
  private _getSearchResults(): Observable<GallerySection[]> {
    return merge(
      this.photosSubject$.pipe(debounceTime(300)),
      this._scrollToBottomEmitter()
    ).pipe(
      tap(() => this.loading = true),
      switchMap((currentValue: string | boolean) => {
        if (typeof currentValue === 'string') {
          return this.pexelsService.searchImages(currentValue).pipe(
            map((result: any) => [result])
          )
        } else {
          const mostRecentResult = this.latestResults[this.latestResults.length - 1];
          const currentPage = mostRecentResult?.page;
          const newPage = currentPage + 1;
          return this.pexelsService.searchImages(mostRecentResult.query, newPage).pipe(
            map((result: any) => [...this.latestResults, result])
          )
        }
      }),
      tap((results) => {
        console.log(results);
        this.loading = false;
        this.latestResults = results
      }),
    )
  }

  /**
   * Observable event listener on window.scroll
   * @returns {Observable<boolean>} : Observable emitting "true" if user scrolls to bottom
   */
  private _scrollToBottomEmitter(): Observable<boolean> {
    return fromEvent(window, 'scroll').pipe(
      map(() => window.scrollY),
      filter((scrollY: number) => {
        // proceed if we've reached the bottom of the window, otherwise emit nothign
        return (scrollY + window.innerHeight) === this.document.body.scrollHeight;
      }),
      mapTo(true) // if passes filter, return true otherwise do not emit to observers
    )
  }


  /**********************************************************
   * Helpers / Other
   **********************************************************/

  /**
   * Calculates the pixel size for fitting the photo as large as possible into 
   * 90% of the window
   * @param photo {PexelsPhoto} : Photo to calculate fit for
   * @returns { width: string; height: string } : dimensions
   */
  private _calculateMaxPhotoDimensions(photo: PexelsPhoto): { width: string; height: string } {
    const maxPercentOfWindow = 0.82;
    const windowWidth = window.innerWidth * maxPercentOfWindow;
    const windowHeight = window.innerHeight * maxPercentOfWindow;
    const scale = Math.min(windowWidth/photo.width, windowHeight/photo.height);
    const calcPixelValue = (val: number) => `${val * scale}px`;
    return {
      width: calcPixelValue(photo.width),
      height: `${photo.height * scale + 62}px`
    };
  }

  /**
   * Opens photo dialog with provided config prameters
   * @param width : string
   * @param height : string
   * @param photo : PexelsPhoto
   * @returns {Observable<boolean>} Emits value only if user hit download
   */
  private _openPhotoDialog(width: string, height: string, photo: PexelsPhoto): Observable<boolean> {
    return this.dialog
      .open(PhotoDialogComponent, { width, height, data: photo })
      .afterClosed()
      .pipe(filter((dialogResult: boolean) => !!dialogResult)) // only proceed if download clicked
  }
}

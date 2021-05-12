// external
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, mapTo, mergeMap, switchMap, take, tap, throttleTime } from 'rxjs/operators';

// internal
import { PhotoDialogComponent } from './components/photo-dialog/photo-dialog.component';
import { GallerySection, Photo } from './models';
import { PexelsService } from './services/pexels.service';
import { calculateMaxPhotoDimensions } from './utils/helpers';

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
  public emptyResults$: Observable<boolean>;
  public loading: boolean;

  constructor(
    private _pexelsService: PexelsService,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.searchResults$ = this._getSearchResults()
    this.emptyResults$ = this.searchResults$.pipe(map((gallerySections) => {
      return !gallerySections || gallerySections.length === 0 || gallerySections[0]?.photos?.length === 0;
    }))
  }


  /**********************************************************
   * Template Actions
   **********************************************************/

  public onSearchInputted(query: string) {
    this.photosSubject$.next(query);
  }

  /**
   * Opens photo dialog and then downloads photo depending on result
   * @param photo : Photo
   */
  public onPhotoClicked(photo: Photo) {
    const { width, height } = calculateMaxPhotoDimensions(photo);
    this._openPhotoDialog(width, height, photo).pipe(
      take(1), // handle close at max once
      mergeMap(() => this._pexelsService.getDownloadablePhotoUrl(photo.src.original))
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
          return this._pexelsService.getGalleryResults(currentValue).pipe(
            map((result: any) => [result])
          )
        } else {
          const mostRecentResult = this.latestResults[this.latestResults.length - 1];
          const currentPage = mostRecentResult?.page;
          const newPage = currentPage + 1;
          return this._pexelsService.getGalleryResults(mostRecentResult.query, newPage).pipe(
            map((result: any) => [...this.latestResults, result])
          )
        }
      }),
      tap((results) => {
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
      mapTo(true), // if passes filter, return true otherwise do not emit to observers
      throttleTime(500), // prevent new values from emitting while loading new results
    )
  }


  /**********************************************************
   * Helpers / Other
   **********************************************************/

  /**
   * Opens photo dialog with provided config prameters
   * @param width : string
   * @param height : string
   * @param photo : Photo
   * @returns {Observable<boolean>} Emits value only if user hit download
   */
  private _openPhotoDialog(width: string, height: string, photo: Photo): Observable<boolean> {
    return this._dialog
      .open(PhotoDialogComponent, { width, height, data: photo })
      .afterClosed()
      .pipe(filter((dialogResult: boolean) => !!dialogResult)) // only proceed if download clicked
  }
}
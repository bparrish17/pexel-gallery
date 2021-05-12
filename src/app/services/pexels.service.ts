import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GallerySection, PexelsSearchResponse } from '../models';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class PexelsService {
  private api_key: string = '563492ad6f91700001000001cf90ff95995f419da77b43146fa201e6';
  private baseURL: string = 'https://api.pexels.com'
  private photosURL: string = `${this.baseURL}/v1`;

  constructor(
    private _http: HttpClient,
    private _sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Fetches Images for Gallery
   * @param query : string
   * @param page (optional) : number
   * @returns {Observable<GallerySection>} Observable resolving to a section of 30 photos
   */
  public getGalleryResults(query: string, page?: number): Observable<GallerySection> {
    const headers = new HttpHeaders({ Authorization: this.api_key })
    const params = {
      query,
      page: page ? `${page}` : '0',
      per_page: '30'
    };
    const options = { params, headers };
    return this.searchImages(options).pipe(
      map((response: PexelsSearchResponse) => this._convertResponseToGallerySection(query, response)),
      catchError(() => of({ photos: [], page: 0, query }))
    );
  }

  public searchImages(options: { params: any, headers: any }): Observable<PexelsSearchResponse> {
    return this._http.get<PexelsSearchResponse>(`${this.photosURL}/search`, options);
  }

  /**
   * Converts Photo Source URL into Downloadable URL
   * @param url : string
   * @returns {Observable<string>} Observable resolving to downloadable URL
   */
  public getDownloadablePhotoUrl(url: string): Observable<string> {
    const snackbarRef = this._snackBar.open('Downloading Image...', 'Dismiss')
    return from(fetch(url).then((res) => res.blob())).pipe(
      map((blob) => URL.createObjectURL(blob)),
      tap(() => snackbarRef.dismiss())
    )
  }

  private _convertResponseToGallerySection(query: string, response: PexelsSearchResponse): GallerySection {
    const sanitize = (url: string) => this._sanitizer.bypassSecurityTrustResourceUrl(url);
    const photos = response.photos.map((photo) => {
      return {
        ...photo,
        galleryUrl: sanitize(photo.src.medium),
        expandedUrl: sanitize(photo.src.large2x)
      }
    })
    return { photos, page: Number(response.page), query }
  }
}

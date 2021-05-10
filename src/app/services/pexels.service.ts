import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { PexelsPhoto, PexelsSearchResponse, Photo } from '../models';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  private api_key: string = '563492ad6f91700001000001cf90ff95995f419da77b43146fa201e6';
  private baseURL: string = 'https://api.pexels.com'
  private photosURL: string = `${this.baseURL}/v1`;
  // private videosURL: string = `${this.baseURL}/videos`;

  constructor(private _http: HttpClient, private _sanitizer: DomSanitizer, private _snackBar: MatSnackBar) {}

  public searchImages(query: string): Observable<Photo[]> {
    const headers = new HttpHeaders({ Authorization: this.api_key })
    const params = {
      query,
      page: '0',
      per_page: '30'
    };
    const options = { params, headers };
    const sanitize = (url: string) => this._sanitizer.bypassSecurityTrustResourceUrl(url);
    return this._http.get<PexelsSearchResponse>(`${this.photosURL}/search`, options).pipe(
      pluck('photos'),
      map((photos: PexelsPhoto[]) => {
        return photos.map((photo) => {
          return {
            ...photo,
            galleryUrl: sanitize(photo.src.medium),
            expandedUrl: sanitize(photo.src.large2x)
          }
        })
      }),
      catchError(() => of([]))
    )
  }

  public getDownloadablePhotoUrl(url: string): Observable<string> {
    const snackbarRef = this._snackBar.open('Downloading Image...', 'Dismiss')
    return from(fetch(url).then((res) => res.blob())).pipe(
      map((blob) => URL.createObjectURL(blob)),
      tap(() => snackbarRef.dismiss())
    )
  }
}

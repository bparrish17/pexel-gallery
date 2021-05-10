import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';
import { PexelsPhoto, PexelsSearchResponse, Photo } from '../models';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  private api_key: string = '563492ad6f91700001000001cf90ff95995f419da77b43146fa201e6';
  private baseURL: string = 'https://api.pexels.com'
  private photosURL: string = `${this.baseURL}/v1`;
  // private videosURL: string = `${this.baseURL}/videos`;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  public searchImages(query: string): Observable<Photo[]> {
    const headers = new HttpHeaders({ Authorization: this.api_key })
    const params = {
      query,
      page: '0',
      per_page: '30'
    };
    const options = { params, headers };
    const sanitize = (url: string) => this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return this.http.get<PexelsSearchResponse>(`${this.photosURL}/search`, options).pipe(
      pluck('photos'),
      map((photos: PexelsPhoto[]) => {
        return photos.map((photo) => {
          return {
            ...photo,
            galleryUrl: sanitize(photo.src.medium),
            expandedUrl: sanitize(photo.src.original)
          }
        })
      }),
      catchError(() => of([]))
    )
  }
}

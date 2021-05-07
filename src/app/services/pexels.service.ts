import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { PexelsPhoto, PexelsSearchResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PexelsService {
  private api_key: string = '563492ad6f91700001000001cf90ff95995f419da77b43146fa201e6';
  private pexelsURL: string = 'https://api.pexels.com/v1';

  constructor(private http: HttpClient) {}

  public searchImages(query: string): Observable<PexelsPhoto[]> {
    const headers = new HttpHeaders({ Authorization: this.api_key })
    const options = { params: { query }, headers };
    return this.http.get<PexelsSearchResponse>(`${this.pexelsURL}/search`, options).pipe(pluck('photos'))
  }
}

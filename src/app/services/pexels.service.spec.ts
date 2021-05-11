import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PexelsService } from './pexels.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { mockPexelsSearchResponse } from '../utils/mocks';

describe('PexelsService', () => {
  const expectedURL = 'https://api.pexels.com/v1/search?query=test&page=0&per_page=30';
  let service: PexelsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule]
    });
    service = TestBed.inject(PexelsService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[Method] searchImages', () => {
    it('should return an observable', () => {
      const call = service.searchImages('test')
      expect(call).toBeInstanceOf(Observable);
    });

    it('should hit the Pexels API with the expected parameters', (done) => {
      service.searchImages('test').subscribe()
      const req = httpTestingController.expectOne(expectedURL)
      req.flush({});
      expect(req.request.method).toEqual('GET')
      done()
    });

    it('should convert result into a gallery section', (done) => {
      // @ts-ignore
      const convertSpy = spyOn(service, '_convertResponseToGallerySection');
      service.searchImages('test').subscribe(() => {
        expect(convertSpy).toHaveBeenCalled();
        done();
      })
      const req = httpTestingController.expectOne(expectedURL)
      req.flush(mockPexelsSearchResponse);
    });

    it('should respond with empty response on error', (done) => {
      // @ts-ignore
      spyOn(service, '_convertResponseToGallerySection').and.callFake(() => {
        throw new Error()
      });
      service.searchImages('test').subscribe((result) => {
        expect(result).toEqual({ photos: [], page: 0, query: 'test' })
        done();
      })
      const req = httpTestingController.expectOne(expectedURL)
      req.flush(mockPexelsSearchResponse);
    });
  })

  describe('[Method] _convertResponseToGallerySection', () => {
    it('should return instance of GallerySection', () => {
      // @ts-ignore
      const gallery = service._convertResponseToGallerySection('test', mockPexelsSearchResponse);
      const examplePhoto = gallery.photos[0];
      expect(examplePhoto.expandedUrl).toBeDefined();
      expect(examplePhoto.galleryUrl).toBeDefined();
      expect(examplePhoto.src).toBeDefined();
      expect(gallery.query).toBe('test');
      expect(gallery.page).toEqual(1);
    })
  });
});

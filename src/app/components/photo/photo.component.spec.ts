import { Shallow } from "shallow-render";
import { Photo } from '../../models';
import { PhotoComponent } from './photo.component';
import { AppModule } from "src/app/app.module";
import { ɵDomSanitizerImpl } from '@angular/platform-browser/';

export function fakeSanitize(value: string){
 const sanitizer = new ɵDomSanitizerImpl(document);
 return sanitizer.bypassSecurityTrustResourceUrl(value);
}

describe('PhotoComponent', () => {
  const fakePhoto = { galleryUrl: fakeSanitize('test.com') }
  let shallow: Shallow<PhotoComponent>;

  beforeEach(() => {
    shallow = new Shallow(PhotoComponent, AppModule);
  });

  it('should create', async () => {
    const { instance } = await shallow.render({ bind: { photo: fakePhoto }})
    expect(instance).toBeDefined();
  });

  describe('[Method] onPhotoClicked', () => {
    it('should emit instance photo on click', async () => {
      const { instance } = await shallow.render({ bind: { photo: { galleryUrl: fakeSanitize('test.com') }}})
      instance.onPhotoClicked();
      expect(instance.onPhotoClick.emit).toHaveBeenCalledWith(fakePhoto as Photo);
    })
  });
});

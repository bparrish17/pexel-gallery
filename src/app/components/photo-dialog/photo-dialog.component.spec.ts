import { Shallow } from "shallow-render";
import { PhotoDialogComponent } from './photo-dialog.component';
import { AppModule } from "src/app/app.module";
import { bootstrapUnitTest } from "src/app/utils/helpers";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { mockPexelsSearchResponse } from "src/app/utils/mocks";

bootstrapUnitTest();

describe('PhotoDialogComponent', () => {
  const fakePhoto = mockPexelsSearchResponse.photos[0];
  let shallow: Shallow<PhotoDialogComponent>;
  let instance: any;
  let find: any;

  beforeEach(async () => {
    const mockDialogRef = { close: () => {}}
    shallow = new Shallow(PhotoDialogComponent, AppModule);
    const { instance: inst, find: f } = await shallow
      .provide({ provide: MatDialogRef, useValue: mockDialogRef })
      .provideMock({ provide: MAT_DIALOG_DATA, useValue: fakePhoto })
      .render()
    instance = inst;
    find = f;
  });

  it('should create', () => {
    expect(instance).toBeDefined();
  });

  it('should have a header of the photographers name', async () => {
    expect(find('h2').nativeElement.textContent).toBe(fakePhoto.photographer);
  });

  it('should render the photo with the app-photo component', async () => {
    expect(find('app-photo').nativeElement).toBeDefined();
  });

  it('should have a close and download button', async () => {
    const buttons = find('button');
    expect(buttons.length).toEqual(2);
  });
});

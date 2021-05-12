// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// internal
import { AppComponent } from './app.component';
import { PexelsService } from './services/pexels.service';
import { HeaderComponent } from './components/header/header.component';
import { PhotoComponent } from './components/photo/photo.component';
import { PhotoDialogComponent } from './components/photo-dialog/photo-dialog.component';
import { DialogOffsetDirective } from './directives/dialog-offset.directive';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PhotoComponent,
    PhotoDialogComponent,
    DialogOffsetDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [PexelsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

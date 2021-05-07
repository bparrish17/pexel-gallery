import { Component, OnInit } from '@angular/core';
import { PexelsService } from './services/pexels.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private pexelsService: PexelsService) {}

  ngOnInit() {
    this.pexelsService.searchImages('a').subscribe(console.log);
  }
}

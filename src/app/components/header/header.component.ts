import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() searchFormControl: FormControl;
  @Output() onSearchInput = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  public onInputChanged(evt: any) {
    const input = evt?.target?.value;
    this.onSearchInput.emit(input);
  }
}

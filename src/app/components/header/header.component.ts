import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Output() onSearchInput = new EventEmitter<string>();

  public onInputChanged(evt: any) {
    const input = evt?.target?.value;
    this.onSearchInput.emit(input);
  }
}

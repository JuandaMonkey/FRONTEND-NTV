import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() title: string = '';
  inputValue: string = '';

  @Output() searchChange = new EventEmitter<string>();

  onInputChange() {
    this.searchChange.emit(this.inputValue);
  }
}

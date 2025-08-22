import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-osk',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './on-screen-keyboard.component.html',
  styleUrls: ['./on-screen-keyboard.component.scss'],
})
export class OnScreenKeyboardComponent {
  @Input() visible = false;
  @Output() value = new EventEmitter<string>();
  buffer = '';
  row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  row2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  row3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  press(k: string) {
    this.buffer += k;
    this.value.emit(this.buffer);
  }
  backspace() {
    this.buffer = this.buffer.slice(0, -1);
    this.value.emit(this.buffer);
  }
  enter() {
    this.value.emit(this.buffer);
  }
}

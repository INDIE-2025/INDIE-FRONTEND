import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.html',
  styleUrl: './popup-message.scss',
  standalone: true,
  imports: [CommonModule]
})
export class PopupMessageComponent {
  @Input() message: string | null = null;
  @Input() visible: boolean = false;
}

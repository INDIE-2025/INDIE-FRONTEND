import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.html',
  styleUrl: './popup-message.scss',
  standalone: true,
  imports: []
})
export class PopupMessageComponent {
  @Input() message: string | null = null;
  @Input() visible: boolean = false;
}

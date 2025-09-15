import { Component, Input, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss'
})
export class EventCard implements OnInit {
  @Input() id: number | string = '';
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() time: string = '';
  @Input() location: string = '';
  @Input() image: string = '';
  @Input() creator: string = '';
  @Input() collaborator: string = '';
  @Input() interested: number = 0;
  @Input() description: string = '';
  
  imageLoaded = false;
  
  ngOnInit() {
    if (this.image) {
      const img = new Image();
      img.onload = () => {
        this.imageLoaded = true;
      };
      img.src = this.image;
    } else {
      this.imageLoaded = true;
    }
  }
}
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
  @Output() interestChanged = new EventEmitter<{id: number | string, isInterested: boolean}>();
  
  imageLoaded = false;
  isInterested = false;
  
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
  
  toggleInterest() {
    this.isInterested = !this.isInterested;
    
    // Si está interesado, incrementar el contador, de lo contrario decrementar
    if (this.isInterested) {
      this.interested += 1;
    } else {
      this.interested = Math.max(0, this.interested - 1);
    }
    
    // Emitir el evento para que el componente padre pueda manejarlo si es necesario
    this.interestChanged.emit({
      id: this.id,
      isInterested: this.isInterested
    });
  }
}
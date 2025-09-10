import { Component, OnInit } from '@angular/core';
import  daygridPlugin  from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  standalone: true,
})
export class Calendar implements OnInit {
  
  public events: any[] = [];
  public options: any;


  constructor() {}

  ngOnInit(): void {

    this.options = {
      plugins: [daygridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: new Date(),
      locale: esLocale,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
    }

    this.events = [
      {
        title: "Evento 1",
        start: new Date(),
        description: "Descripción del evento 1",
      },
      {
        title: "Evento 2",
        start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), 
        description: "Descripción del evento 2",
      },
      {
        title: "Evento 3",
        start: new Date(new Date().getTime() + 48 * 60 * 60 * 1000),
        end: new Date(new Date().getTime() + 72 * 60 * 60 * 1000),
        description: "Descripción del evento 3",
      }
    ]
    
  }

 

}

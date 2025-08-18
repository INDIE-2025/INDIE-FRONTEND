import { Component } from '@angular/core';
import { Carousel } from "../../components/carousel/carousel";
import { Calendar } from "../../components/calendar/calendar";
import { Galleria } from "../../components/galleria/galleria";


@Component({
  selector: 'app-profile',
  imports: [Carousel, Calendar, Galleria],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  

}

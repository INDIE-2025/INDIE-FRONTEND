import { Component } from '@angular/core';
import { Carousel } from "../../components/carousel/carousel";
import { Calendar } from "../../components/calendar/calendar";
import { Comments } from "../../components/comments/comments";

@Component({
  selector: 'app-profile',
  imports: [Carousel, Calendar, Comments],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  

}

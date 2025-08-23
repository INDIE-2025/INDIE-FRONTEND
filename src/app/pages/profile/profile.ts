import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupService } from '../../services/popup.service';
import { Carousel } from "../../components/carousel/carousel";
import { Calendar } from "../../components/calendar/calendar";
import { Galleria } from "../../components/galleria/galleria";
import { PopupMessageComponent } from '../../components/popup-message/popup-message';


@Component({
  selector: 'app-profile',
  imports: [Carousel, Calendar, Galleria, PopupMessageComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  popupMessage: string | null = null;
  popupVisible: boolean = false;
  private popupSub?: Subscription;
  private visibleSub?: Subscription;

  constructor(private popupService: PopupService) {}

  ngOnInit() {
    this.popupSub = this.popupService.message$.subscribe(msg => this.popupMessage = msg);
    this.visibleSub = this.popupService.visible$.subscribe(v => this.popupVisible = v);
  }

  ngOnDestroy() {
    this.popupSub?.unsubscribe();
    this.visibleSub?.unsubscribe();
  }
}

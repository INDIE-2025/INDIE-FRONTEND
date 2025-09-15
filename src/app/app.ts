import { Component, signal } from '@angular/core';
import { PopupService } from './services/popup.service';
import { PopupMessageComponent } from './components/popup-message/popup-message';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { ProfileComponent } from './pages/profile/profile';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, Header, Footer, ProfileComponent, PopupMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('indie-front-end');
  message: string | null = null;
  visible: boolean = false;

  constructor(private popupService: PopupService) {
    this.popupService.message$.subscribe(msg => this.message = msg);
    this.popupService.visible$.subscribe(vis => this.visible = vis);
  }
}

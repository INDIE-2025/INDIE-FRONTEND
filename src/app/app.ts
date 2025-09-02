import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { ProfileComponent } from './pages/profile/profile';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, Header, Footer, ProfileComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('indie-front-end');
}

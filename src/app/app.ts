import { PopupService } from './services/popup.service';
import { PopupMessageComponent } from './components/popup-message/popup-message';
import { Component, signal, computed } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, PopupMessageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('indie-front-end');
  message: string | null = null;
  visible: boolean = false;

  private readonly hideShellRoutes = [
    '/login',
    '/register',
    '/post-register',
    '/password-recovery',
    '/new-password', // incluye token: /new-password/:token
    '/terminos-y-condiciones',
    '/politica-de-privacidad'
  ];

  currentUrl = signal<string>('');
  hideChrome = computed(() => this.shouldHideChrome(this.currentUrl()));

  constructor(private router: Router, private popupService: PopupService) {
     this.popupService.message$.subscribe(msg => this.message = msg);
    this.popupService.visible$.subscribe(vis => this.visible = vis);
    this.currentUrl.set(this.router.url);
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentUrl.set(ev.urlAfterRedirects || ev.url);
      }
    });
  }

  private shouldHideChrome(url: string): boolean {
    // Normaliza y compara por prefijo para rutas con parámetros
    const path = url?.split('?')[0] || '';
    return this.hideShellRoutes.some(r => path === r || path.startsWith(r + '/'));
  }
}

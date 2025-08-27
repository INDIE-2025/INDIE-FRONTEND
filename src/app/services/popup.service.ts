import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  private visibleSubject = new BehaviorSubject<boolean>(false);

  message$ = this.messageSubject.asObservable();
  visible$ = this.visibleSubject.asObservable();
  private timeout: any;

  show(message: string, duration = 2000) {
    this.messageSubject.next(message);
    this.visibleSubject.next(true);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.visibleSubject.next(false);
      this.messageSubject.next(null);
    }, duration);
  }
}

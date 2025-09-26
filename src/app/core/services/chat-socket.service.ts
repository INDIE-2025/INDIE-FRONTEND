import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Subject, filter, take } from 'rxjs';
import { AuthService } from './auth.service';
import { MensajeDto } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatSocketService implements OnDestroy {
  private client: Client | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor(private auth: AuthService) {}

  ngOnDestroy(): void {
    this.disconnect();
  }

  connect(): void {
    if (this.client && this.connected$.value) return;

    const token = this.auth.getToken();
    const url = `${environment.apiUrl}/ws`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      debug: () => {}
    });

    this.client.onConnect = () => this.connected$.next(true);
    this.client.onStompError = () => this.connected$.next(false);
    this.client.onWebSocketClose = () => this.connected$.next(false);

    this.client.activate();
  }

  disconnect(): void {
    if (!this.client) return;
    try { this.subscriptions.forEach((s) => s.unsubscribe()); } catch {}
    this.subscriptions.clear();
    this.client.deactivate();
    this.client = null;
    this.connected$.next(false);
  }

  connection$(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  subscribeMessages(chatId: string): Observable<MensajeDto> {
    const out$ = new Subject<MensajeDto>();
    const dest = `/topic/chat/${chatId}`;
    this.waitUntilConnected().then(() => {
      const sub = this.client!.subscribe(dest, (msg: IMessage) => {
        try { out$.next(JSON.parse(msg.body)); } catch {}
      });
      this.subscriptions.set(dest, sub);
    }).catch(() => {/* ignore timeout */});
    return out$.asObservable();
  }

  subscribeTyping(chatId: string): Observable<{ userId: string; typing: boolean }> {
    const out$ = new Subject<{ userId: string; typing: boolean }>();
    const dest = `/topic/chat/${chatId}/typing`;
    this.waitUntilConnected().then(() => {
      const sub = this.client!.subscribe(dest, (msg: IMessage) => {
        try { out$.next(JSON.parse(msg.body)); } catch {}
      });
      this.subscriptions.set(dest, sub);
    }).catch(() => {/* ignore timeout */});
    return out$.asObservable();
  }

  subscribeRead(chatId: string): Observable<string> {
    const out$ = new Subject<string>();
    const dest = `/topic/chat/${chatId}/read`;
    this.waitUntilConnected().then(() => {
      const sub = this.client!.subscribe(dest, (msg: IMessage) => {
        try { out$.next(JSON.parse(msg.body)); } catch { out$.next(msg.body); }
      });
      this.subscriptions.set(dest, sub);
    }).catch(() => {/* ignore timeout */});
    return out$.asObservable();
  }

  sendMessage(chatId: string, mensaje: string): void {
    this.waitUntilConnected().then(() => {
      this.client!.publish({ destination: `/app/chat/${chatId}`, body: JSON.stringify({ mensaje }) });
    }).catch(() => {/* ignore timeout */});
  }

  sendTyping(chatId: string, typing: boolean): void {
    this.waitUntilConnected().then(() => {
      this.client!.publish({ destination: `/app/chat/${chatId}/typing`, body: JSON.stringify({ typing }) });
    }).catch(() => {/* ignore timeout */});
  }

  private ensureConnected() {
    if (!this.connected$.value) this.connect();
  }

  private waitUntilConnected(timeoutMs = 7000): Promise<void> {
    if (this.client && this.connected$.value) return Promise.resolve();
    this.connect();
    return new Promise((resolve, reject) => {
      const sub = this.connected$.pipe(filter(Boolean), take(1)).subscribe(() => {
        sub.unsubscribe();
        resolve();
      });
      if (timeoutMs > 0) {
        setTimeout(() => {
          try { sub.unsubscribe(); } catch {}
          if (!(this.connected$.value)) reject(new Error('STOMP connection timeout'));
        }, timeoutMs);
      }
    });
  }
}

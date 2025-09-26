import { Injectable } from '@angular/core';
import { BehaviorSubject, map, interval, Subscription } from 'rxjs';
import { ChatApiService } from '../core/services/chat-api.service';
import { ChatSocketService } from '../core/services/chat-socket.service';
import { ChatSummaryDto, MensajeDto } from '../core/models/chat.models';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class ChatServiceFacade {
  chats$ = new BehaviorSubject<ChatSummaryDto[] | null>(null);
  activeChatId$ = new BehaviorSubject<string | null>(null);
  messages$ = new BehaviorSubject<MensajeDto[]>([]);
  unreadTotal$ = this.chats$.pipe(
    map(list => (list || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0))
  );
  typing$ = new BehaviorSubject<boolean>(false);

  private pages = new Map<string, number>();
  private subs: Subscription[] = [];
  private pollSub?: Subscription;

  constructor(private api: ChatApiService, private ws: ChatSocketService, private auth: AuthService) {}

  loadChats() {
    this.api.listMyChats().subscribe((chs) => this.chats$.next(chs));
  }

  openChat(chatId: string) {
    // limpiar subs previos
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
    this.activeChatId$.next(chatId);
    // cargar primera página
    this.pages.set(chatId, 0);
    this.api.listMessages(chatId, 0, 50).subscribe((page) => this.messages$.next(page.content || page));
    // suscribirse a tiempo real
    const subMsg = this.ws.subscribeMessages(chatId).subscribe((m) => {
      this.messages$.next([...this.messages$.value, m]);
      this.loadChats();
    });
    this.subs.push(subMsg);
    const subRead = this.ws.subscribeRead(chatId).subscribe(() => this.loadChats());
    this.subs.push(subRead);
    const me = this.auth.getCurrentUserId();
    const subTyping = this.ws.subscribeTyping(chatId).subscribe((e) => {
      if (!e) return;
      this.typing$.next(e.userId !== me && !!e.typing);
    });
    this.subs.push(subTyping);
    // marcar leído
    this.api.markAsRead(chatId).subscribe();
  }

  sendMessage(chatId: string, texto: string) {
    this.ws.sendMessage(chatId, texto);
  }

  typing(chatId: string, isTyping: boolean) {
    this.ws.sendTyping(chatId, isTyping);
  }

  loadMore(chatId: string) {
    const current = this.pages.get(chatId) ?? 0;
    const next = current + 1;
    this.api.listMessages(chatId, next, 50).subscribe((page) => {
      const content = page.content || [];
      if (content.length > 0) {
        this.pages.set(chatId, next);
        this.messages$.next([...(content as MensajeDto[]), ...this.messages$.value]);
      }
    });
  }

  startAutoRefresh(ms = 30000) {
    this.pollSub?.unsubscribe();
    this.pollSub = interval(ms).subscribe(() => this.loadChats());
  }
}


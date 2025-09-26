import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatServiceFacade } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MensajeDto } from '../../core/models/chat.models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  text = '';
  private typingTimer: any;
  myId: string | null = null;

  constructor(
    public facade: ChatServiceFacade,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.myId = this.auth.getCurrentUserId();
    this.facade.loadChats();
    const chatToOpen = this.route.snapshot.queryParamMap.get('open');
    if (chatToOpen) {
      this.facade.openChat(chatToOpen);
    }
  }

  reload(){ this.facade.loadChats(); }

  open(id: string) { this.facade.openChat(id); }

  send() {
    const chatId = this.facade.activeChatId$.value;
    if (!chatId || !this.text.trim()) return;
    this.facade.sendMessage(chatId, this.text.trim());
    this.text = '';
    this.facade.typing(chatId, false);
  }

  onTyping() {
    const chatId = this.facade.activeChatId$.value;
    if (!chatId) return;
    this.facade.typing(chatId, true);
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => this.facade.typing(chatId, false), 1500);
  }

  onScroll(ev: Event) {
    const el = ev.target as HTMLElement | null;
    if (!el) return;
    if (el.scrollTop === 0) {
      const chatId = this.facade.activeChatId$.value;
      if (chatId) this.facade.loadMore(chatId);
    }
  }

  isMine(m: MensajeDto): boolean {
    return !!m?.idEmisor?.id && m.idEmisor.id === this.myId;
  }
}

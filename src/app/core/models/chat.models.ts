export interface UsuarioRef {
  id: string;
  username?: string;
  emailUsuario?: string;
}

export interface ChatRef {
  id: string;
}

export interface MensajeDto {
  id: string;
  mensaje: string;
  idEmisor: UsuarioRef;
  idChat: ChatRef;
  createdAt: string;
}

export interface ChatSummaryDto {
  chatId: string;
  otherUserId: string | null;
  otherUsername: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}


import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor(private api: ApiService) {
    this.socket = io('http://localhost:5000');
  }

  getMyChat(): Observable<any> {
    return this.api.get('chats/my', true);
  }

  getAllChats(): Observable<any> {
    return this.api.get('chats', true);
  }

  getChatById(id: string): Observable<any> {
    return this.api.get(`chats/${id}`, true);
  }

  sendMessage(chatId: string, content: string): Observable<any> {
    return this.api.post('chats/message', { chatId, content }, true);
  }

  joinChat(chatId: string): void {
    this.socket.emit('joinChat', chatId);
  }

  emitMessage(chatId: string, message: any): void {
    this.socket.emit('sendMessage', { chatId, message });
  }

  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newMessage', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
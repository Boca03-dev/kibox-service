import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  chatId = '';
  messages: any[] = [];
  newMessage = '';
  currentUserId = '';
  private messageSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id;

    setTimeout(() => {
      this.chatService.getMyChat().subscribe({
        next: (chat) => {
          this.chatId = chat._id;
          this.messages = chat.messages || [];
          this.chatService.joinChat(this.chatId);
          this.scrollToBottom();
          this.cdr.detectChanges();
        }
      });

      this.messageSub = this.chatService.onNewMessage().subscribe((data) => {
        if (data.chatId === this.chatId) {
          this.messages.push(data.message);
          this.scrollToBottom();
          this.cdr.detectChanges();
        }
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.messageSub?.unsubscribe();
  }

  isMyMessage(message: any): boolean {
    return message.sender?._id === this.currentUserId || message.sender === this.currentUserId;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    this.chatService.sendMessage(this.chatId, content).subscribe({
      next: (chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        this.chatService.emitMessage(this.chatId, lastMessage);
        this.cdr.detectChanges();
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
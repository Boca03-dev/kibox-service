import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css'
})
export class ChatWidget implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isLoggedIn = false;
  isAdmin = false;
  hasChat = false;
  isOpen = false;
  chatId = '';
  messages: any[] = [];
  newMessage = '';
  unreadCount = 0;
  currentUser: any = null;
  private socketSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chatService.chatCreated$.subscribe(() => {
      this.checkChat();
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
      this.currentUser = user;

      if (user && !this.isAdmin) {
        this.checkChat();
      }
    });

    this.socketSub = this.chatService.onNewMessage().subscribe((data) => {
      if (data.chatId === this.chatId) {
        this.messages.push(data.message);
        if (!this.isOpen) this.unreadCount++;
        this.scrollToBottom();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
  }

  checkChat(): void {
    this.chatService.hasExistingChat().subscribe({
      next: (data) => {
        this.hasChat = data.exists;
        if (data.exists) {
          this.chatId = data.chatId;
          this.chatService.joinChat(this.chatId);
          this.loadMessages();
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadMessages(): void {
    this.chatService.getMyChat().subscribe({
      next: (chat) => {
        this.messages = chat.messages;
        this.unreadCount = chat.messages.filter((m: any) =>
          m.sender?.role === 'admin' && !m.read
        ).length;
        this.cdr.detectChanges();
      }
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      this.scrollToBottom();
    }
    this.cdr.detectChanges();
  }

  isMyMessage(message: any): boolean {
    return message.sender?._id === this.currentUser?.id ||
           message.sender === this.currentUser?.id;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    this.chatService.sendMessage(this.chatId, content).subscribe({
      next: (chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        this.chatService.emitMessage(this.chatId, lastMessage);
        this.scrollToBottom();
        this.cdr.detectChanges();
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
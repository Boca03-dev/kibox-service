import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat';
import { AuthService } from '../../../services/auth';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [FormsModule, DatePipe, AdminSidebar],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class AdminChat implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  chats: any[] = [];
  selectedChat: any = null;
  newMessage = '';
  currentUser: any = null;
  private socketSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    setTimeout(() => {
      this.chatService.getAllChats().subscribe({
        next: (chats) => {
          this.chats = chats;
          chats.forEach((chat: any) => {
            this.chatService.joinChat(chat._id);
          });

          const chatId = this.route.snapshot.paramMap.get('id');
          if (chatId) {
            this.selectChat(chatId);
          }

          this.cdr.detectChanges();
        }
      });

      this.socketSub = this.chatService.onNewMessage().subscribe((data) => {
        const chat = this.chats.find(c => c._id === data.chatId);
        if (chat) {
          chat.messages.push(data.message);
          if (this.selectedChat?._id === data.chatId) {
            this.selectedChat = chat;
            this.scrollToBottom();
          }
          this.cdr.detectChanges();
        }
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
  }

  selectChat(chatId: string): void {
    this.chatService.getChatById(chatId).subscribe({
      next: (chat) => {
        this.selectedChat = chat;
        this.scrollToBottom();
        this.cdr.detectChanges();
      }
    });
  }

  isAdminMessage(message: any): boolean {
    return message.sender?.role === 'admin';
  }

  getUnreadCount(chat: any): number {
    return chat.messages?.filter((m: any) => !m.read && m.sender?.role !== 'admin').length || 0;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedChat) return;

    const content = this.newMessage.trim();
    this.newMessage = '';

    this.chatService.sendMessage(this.selectedChat._id, content).subscribe({
      next: (chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        this.chatService.emitMessage(this.selectedChat._id, lastMessage);
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
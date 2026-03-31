import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { MessageService } from '../../../services/message';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { ChatService } from '../../../services/chat';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe, AdminSidebar],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  messages: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  markAsRead(message: any): void {
    this.messageService.markAsRead(message._id).subscribe({
      next: () => {
        message.read = true;
        this.cdr.detectChanges();
      }
    });
  }

  openChat(email: string): void {
    this.chatService.getAllChats().subscribe({
      next: (chats) => {
        const chat = chats.find((c: any) => c.user?.email === email);
        if (chat) {
          this.router.navigate(['/admin/chat', chat._id]);
        } else {
          alert('Korisnik još nije pokrenuo chat');
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.cdr.detectChanges();
  }
}
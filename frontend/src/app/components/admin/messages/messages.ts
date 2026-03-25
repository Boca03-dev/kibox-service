import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { MessageService } from '../../../services/message';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {
  messages: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
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
      },
      error: () => this.loading = false
    });
  }

  markAsRead(message: any): void {
    this.messageService.markAsRead(message._id).subscribe({
      next: () => message.read = true
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
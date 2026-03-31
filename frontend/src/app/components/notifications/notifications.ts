import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification';
import { AuthService } from '../../services/auth';
import { AdminSidebar } from '../admin/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterLink, DatePipe, AdminSidebar],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  notifications: any[] = [];
  loading = true;
  isAdmin = false;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get readCount(): number {
    return this.notifications.filter(n => n.read).length;
  }

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.notificationService.getNotifications().subscribe({
        next: (data) => {
          this.notifications = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });

      this.authService.currentUser$.subscribe(user => {
        this.isAdmin = user?.role === 'admin';
      });
    }, 0);
  }

  onNotificationClick(notification: any): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification._id).subscribe({
        next: () => {
          notification.read = true;
          this.cdr.detectChanges();
        }
      });
    }
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.cdr.detectChanges();
      }
    });
  }

  deleteOne(event: Event, id: string): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n._id !== id);
        this.cdr.detectChanges();
      }
    });
  }

  deleteAllRead(): void {
    this.notificationService.deleteAllRead().subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => !n.read);
        this.cdr.detectChanges();
      }
    });
  }
}
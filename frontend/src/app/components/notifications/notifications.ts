import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
  notifications: any[] = [];
  loading = true;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  constructor(
    private notificationService: NotificationService,
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
    }, 0);
  }

  getIcon(type: string): string {
    const icons: any = {
      message: '✉️',
      appointment: '📅',
      configuration: '⚙️',
      appointment_status: '🔔'
    };
    return icons[type] || '🔔';
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

  get readCount(): number {
    return this.notifications.filter(n => n.read).length;
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
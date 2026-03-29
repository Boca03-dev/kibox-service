import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private api: ApiService) {}

  getNotifications(): Observable<any> {
    return this.api.get('notifications', true);
  }

  markAsRead(id: string): Observable<any> {
    return this.api.put(`notifications/${id}/read`, {}, true);
  }

  markAllAsRead(): Observable<any> {
    return this.api.put('notifications/read-all', {}, true);
  }

  deleteNotification(id: string): Observable<any> {
    return this.api.delete(`notifications/${id}`, true);
  }

  deleteAllRead(): Observable<any> {
    return this.api.delete('notifications/read-all', true);
  }
}
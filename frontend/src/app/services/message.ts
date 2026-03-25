import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private api: ApiService) {}

  sendMessage(data: any): Observable<any> {
    return this.api.post('messages', data);
  }

  getMessages(): Observable<any> {
    return this.api.get('messages', true);
  }

  markAsRead(id: string): Observable<any> {
    return this.api.put(`messages/${id}/read`, {}, true);
  }
}
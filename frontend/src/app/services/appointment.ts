import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private api: ApiService) {}

  createAppointment(data: any): Observable<any> {
    return this.api.post('appointments', data);
  }

  getAppointments(): Observable<any> {
    return this.api.get('appointments', true);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.api.put(`appointments/${id}`, { status }, true);
  }

  getUserAppointments(): Observable<any> {
    return this.api.get('appointments/my', true);
  }

  markSeenByUser(): Observable<any> {
    return this.api.put('appointments/seen', {}, true);
  }
}
import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private api: ApiService) {}

  createConfiguration(data: any): Observable<any> {
    return this.api.post('configurations', data, true);
  }

  getUserConfigurations(): Observable<any> {
    return this.api.get('configurations/my', true);
  }

  deleteConfiguration(id: string): Observable<any> {
    return this.api.delete(`configurations/${id}`, true);
  }

  generateConfiguration(data: any): Observable<any> {
    return this.api.post('configurations/generate', data);
  }

  getAllConfigurations(): Observable<any> {
    return this.api.get('configurations/all', true);
  }

  sendToAdmin(id: string): Observable<any> {
    return this.api.put(`configurations/${id}/send`, {}, true);
  }
}
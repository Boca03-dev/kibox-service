import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private api: ApiService) {}

  getComponents(type?: string): Observable<any> {
    const endpoint = type ? `components?type=${type}` : 'components';
    return this.api.get(endpoint);
  }

  createComponent(data: any): Observable<any> {
    return this.api.post('components', data, true);
  }

  deleteComponent(id: string): Observable<any> {
    return this.api.delete(`components/${id}`, true);
  }
}
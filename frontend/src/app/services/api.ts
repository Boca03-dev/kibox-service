import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  get(endpoint: string, auth = false): Observable<any> {
    const headers = auth ? this.getHeaders() : new HttpHeaders();
    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers });
  }

  post(endpoint: string, body: any, auth = false): Observable<any> {
    const headers = auth ? this.getHeaders() : new HttpHeaders();
    return this.http.post(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  put(endpoint: string, body: any, auth = false): Observable<any> {
    const headers = auth ? this.getHeaders() : new HttpHeaders();
    return this.http.put(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  delete(endpoint: string, auth = false): Observable<any> {
    const headers = auth ? this.getHeaders() : new HttpHeaders();
    return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers });
  }
}
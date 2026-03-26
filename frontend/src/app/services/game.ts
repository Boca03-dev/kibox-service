import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private api: ApiService) {}

  getGames(): Observable<any> {
    return this.api.get('games');
  }
}
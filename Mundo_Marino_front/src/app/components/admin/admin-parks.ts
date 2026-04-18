import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs';
import {Park} from '../../models/park';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AdminParkService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  parks = signal<Park[]>([]);
  loading = signal(false);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({Authorization: `Bearer ${token}`});
  }

  fetchParks() {
    this.loading.set(true);
    return this.http.get<Park[]>(`${this.API_URL}/parks`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => {
        this.parks.set(data);
        this.loading.set(false);
      })
    );
  }
  create(payload: { name: string; location: string; opening_time: string; closing_time: string }) {
    return this.http.post(`${this.API_URL}/park`, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap((newPark: any) => {
        this.parks.update(list => [...list, newPark]);
      })
    );
  }
  update(id: number, payload: { name: string; location: string; opening_time: string; closing_time: string }) {
    return this.http.put(`${this.API_URL}/park/${id}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        this.parks.update(list =>
          list.map(p => p.id === id ? { ...p, ...payload } : p)
        );
      })
    );
  }

  getById(id: number) {
    return this.http.get<Park>(`${this.API_URL}/park/${id}`, {
      headers: this.getHeaders()
    });
  }
}

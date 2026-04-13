import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { Restaurant } from '../../models/restaurant';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminRestaurantService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin/restaurant`;

  #restaurants = signal<Restaurant[]>([]);
  loading = signal<boolean>(false);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  fetchRestaurants() {
    this.loading.set(true);
    return this.http.get<Restaurant[]>(`${this.API_URL}s`, {
      headers: this.getHeaders()
    }).pipe(
      map(res => {
        const rawData = (res as any).data ?? res;
        return Array.isArray(rawData) ? rawData as Restaurant[] : [];
      }),
      tap(restaurants => {
        this.#restaurants.set(restaurants);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<Restaurant>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }

  create(data: Partial<Restaurant>) {
    return this.http.post<Restaurant>(this.API_URL, data, {
      headers: this.getHeaders()
    }).pipe(
      tap(res => this.#restaurants.update(list => [res, ...list]))
    );
  }

  update(id: number, data: Partial<Restaurant>) {
    return this.http.put<Restaurant>(`${this.API_URL}/${id}`, data, {
      headers: this.getHeaders()
    }).pipe(
      tap(res => this.#restaurants.update(
        list => list.map(r => r.id === id ? res : r)
      ))
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.#restaurants.update(list => list.filter(r => r.id !== id)))
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Restaurant } from '../models/restaurant';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/restaurant';

  #restaurants = signal<Restaurant[]>([]);
  loading = signal<boolean>(false);

  fetchRestaurants() {
    this.loading.set(true);
    return this.http.get<any>(this.API_URL).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];
        return data as Restaurant[];
      }),
      tap(restaurants => {
        this.#restaurants.set(restaurants);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data ?? res as Restaurant)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Restaurant }>(this.API_URL, formData).pipe(
      tap(res => {
        this.#restaurants.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Restaurant }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#restaurants.update(
          list =>
            list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#restaurants.update(list => list.filter(p => p.id !== id));
      })
    );
  }
}

import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs';
import {Restaurant_reservation} from '../models/restaurant_reservation';

@Injectable({
  providedIn: 'root',
})
export class RestaurantReservationService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/restaurant_reservation';

  #restaurant_reservations = signal<Restaurant_reservation[]>([]);
  loading = signal<boolean>(false);

  fetchRestaurant_reservations() {
    this.loading.set(true);
    return this.http.get<any>(this.API_URL).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];
        return data as Restaurant_reservation[];
      }),
      tap(restaurant_reservations => {
        this.#restaurant_reservations.set(restaurant_reservations);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data ?? res as Restaurant_reservation)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Restaurant_reservation }>(this.API_URL, formData).pipe(
      tap(res => {
        this.#restaurant_reservations.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Restaurant_reservation }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#restaurant_reservations.update(
          list =>
            list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#restaurant_reservations.update(list => list.filter(p => p.id !== id));
      })
    );
  }
}


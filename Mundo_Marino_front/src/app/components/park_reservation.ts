import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs';
import {Park_reservation} from '../models/park_reservation';

@Injectable({
  providedIn: 'root',
})
export class Park_reservationService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/park_reservation';

  #park_reservations = signal<Park_reservation[]>([]);
  loading = signal<boolean>(false);

  fetchPark_reservations() {
    this.loading.set(true);
    return this.http.get<any>(this.API_URL).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];
        return data as Park_reservation[];
      }),
      tap(park_reservations => {
        this.#park_reservations.set(park_reservations);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data ?? res as Park_reservation)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Park_reservation }>(this.API_URL, formData).pipe(
      tap(res => {
        this.#park_reservations.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Park_reservation }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#park_reservations.update(
          list =>
            list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#park_reservations.update(list => list.filter(p => p.id !== id));
      })
    );
  }
}



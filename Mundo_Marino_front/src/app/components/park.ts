import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import {Park} from '../models/park';

@Injectable({ providedIn: 'root' })
export class ParkService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/park';

  #parks = signal<Park[]>([]);
  loading = signal<boolean>(false);

  fetchParks() {
    this.loading.set(true);
    return this.http.get<any>(this.API_URL).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];
        return data as Park[];
      }),
      tap(parks => {
        this.#parks.set(parks);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data ?? res as Park)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Park }>(this.API_URL, formData).pipe(
      tap(res => {
        this.#parks.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Park }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#parks.update(
          list =>
            list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#parks.update(list => list.filter(p => p.id !== id));
      })
    );
  }
}


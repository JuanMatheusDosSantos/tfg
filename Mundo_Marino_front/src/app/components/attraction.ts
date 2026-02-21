import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import {Attraction} from '../models/attraction';

@Injectable({ providedIn: 'root' })
export class AttractionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/attraction';

  #attractions = signal<Attraction[]>([]);
  loading = signal<boolean>(false);

  fetchAttractions() {
    this.loading.set(true);
    return this.http.get<any>(this.API_URL).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];
        return data as Attraction[];
      }),
      tap(attractions => {
        this.#attractions.set(attractions);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data ?? res as Attraction)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Attraction }>(this.API_URL, formData).pipe(
      tap(res => {
        this.#attractions.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Attraction }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#attractions.update(
          list =>
            list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#attractions.update(list => list.filter(p => p.id !== id));
      })
    );
  }
}


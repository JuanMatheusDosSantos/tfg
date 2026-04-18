import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { ReservationPrice } from '../../models/reservation-price';
import { Tax } from '../../models/tax';
import { environment } from '../../../environments/environment';
import {Park} from '../../models/park';


@Injectable({
  providedIn: 'root',
})
export class AdminPricesService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  precios = signal<ReservationPrice[]>([]);
  taxes = signal<Tax[]>([]);

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchParks() {
    return this.http.get<Park[]>(`${environment.apiUrl}/admin/parks`, {
      headers: this.getHeaders()
    });
  }

  fetchPrecios() {
    return this.http.get<ReservationPrice[]>(`${this.API_URL}/park_reservation_prices`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => this.precios.set(data.map(p => ({
        ...p,
        adult_price: Number(p.adult_price),
        child_price: Number(p.child_price ?? 0),
      }))))
    );
  }

  fetchTaxes() {
    return this.http.get<Tax[]>(`${this.API_URL}/taxes`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => this.taxes.set(data))
    );
  }

  updatePrecio(id: number, adult_price: number, child_price: number) {
    return this.http.put(`${this.API_URL}/park_reservation_prices/${id}`,
      { adult_price, child_price },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.precios.update(lista =>
          lista.map(p => p.id === id ? { ...p, adult_price, child_price } : p)
        );
      })
    );
  }

  updateTax(id: number, percentage: number) {
    return this.http.put(`${this.API_URL}/taxes/${id}`,
      { percentage },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.taxes.update(lista =>
          lista.map(t => t.id === id ? { ...t, percentage } : t)
        );
      })
    );
  }
  deletePrecio(id: number) {
    return this.http.delete(`${this.API_URL}/park_reservation_prices/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.precios.update(lista => lista.filter(p => p.id !== id)))
    );
  }

  deleteTax(id: number) {
    return this.http.delete(`${this.API_URL}/taxes/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.taxes.update(lista => lista.filter(t => t.id !== id)))
    );
  }

  createTipo(name: string) {
    return this.http.post<{id: number; name: string}>(
      `${this.API_URL}/park_reservation_type`,
      { name },
      { headers: this.getHeaders() }
    );
  }

  createPrecio(payload: { park_id: number; park_reservation_type_id: number; adult_price: number; child_price: number }) {
    return this.http.post(
      `${this.API_URL}/park_reservation_price`,
      payload,
      { headers: this.getHeaders() }
    );
  }

}

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { ReservationPrice } from '../../models/reservation-price';
import { Tax } from '../../models/tax';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AdminPricesService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  precios = signal<ReservationPrice[]>([]);
  taxes = signal<Tax[]>([]);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchPrecios() {
    return this.http.get<ReservationPrice[]>(`${this.API_URL}/park_reservation_prices`, {
      headers: this.getHeaders()
    }).pipe(
      // tap(data => this.precios.set(data))
      tap(data => this.precios.set(data.map(p => ({ ...p, price: Number(p.price) }))))
    );
  }

  fetchTaxes() {
    return this.http.get<Tax[]>(`${this.API_URL}/taxes`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => this.taxes.set(data))
    );
  }

  updatePrecio(id: number, price: number) {
    return this.http.put(`${this.API_URL}/park_reservation_prices/${id}`,
      { price },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.precios.update(lista =>
          lista.map(p => p.id === id ? { ...p, price } : p)
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
}

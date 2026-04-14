import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs';
import {Restaurant_reservation} from '../../models/restaurant_reservation';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AdminRestaurantBookingService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/restaurant_reservation`;
  private readonly ADMIN_URL = `${environment.apiUrl}/admin/restaurant_reservations`;

  #reservas = signal<Restaurant_reservation[]>([]);
  loading = signal<boolean>(false);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {Authorization: `Bearer ${token}`};
  }

  fetchReservas() {
    this.loading.set(true);
    return this.http.get<Restaurant_reservation[]>(this.ADMIN_URL, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => {
        this.#reservas.set(data);
        this.loading.set(false);
      })
    );
  }

  cambiarStatus(reserva: Restaurant_reservation, nuevoStatus: string) {
    return this.http.put(`${environment.apiUrl}/admin/restaurant_reservation/status/${reserva.id}`,
      {
        reservation_date: reserva.reservation_date,
        reservation_hour: reserva.reservation_hour?.substring(0, 5),
        party_size: reserva.party_size,
        status: nuevoStatus
      },
      {headers: this.getHeaders()}
    ).pipe(
      tap(() => {
        this.#reservas.update(lista =>
          lista.map(r => r.id === reserva.id ? {...r, status: nuevoStatus} : r)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        this.#reservas.update(lista => lista.filter(r => r.id !== id));
      })
    );
  }
}

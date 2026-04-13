import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Restaurant_reservation} from '../../models/restaurant_reservation';

@Component({
  selector: 'app-edit-restaurant-booking',
  imports: [],
  templateUrl: './edit-restaurant-booking.html',
  styleUrl: './edit-restaurant-booking.css',
})
export class EditRestaurantBooking {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}`;

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  reserva = signal<Restaurant_reservation | null>(null);

  // Campos del formulario
  reservation_date = signal('');
  reservation_hour = signal('');
  party_size = signal(1);
  status = signal('pending');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Restaurant_reservation>(`${this.apiUrl}/restaurant_reservation/${id}`, { headers }).subscribe({
      next: (reserva) => {
        this.reserva.set(reserva);
        this.reservation_date.set(reserva.reservation_date ?? '');
        this.reservation_hour.set((reserva.reservation_hour ?? '').substring(0, 5));
        this.party_size.set(reserva.party_size ?? 1);
        this.status.set(reserva.status ?? 'pending');
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar la reserva');
        this.cargando.set(false);
      }
    });
  }

  guardar() {
    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const id = this.reserva()?.id;

    const body = {
      reservation_date: this.reservation_date(),
      reservation_hour: this.reservation_hour(),
      party_size: this.party_size(),
      status: this.status(),
    };

    this.http.put(`${this.apiUrl}/restaurant_reservation/${id}`, body, { headers }).subscribe({
      next: () => {
        this.exito.set('Reserva actualizada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate([`/my-booking/restaurant/${id}`]), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar la reserva');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    const id = this.reserva()?.id;
    this.router.navigate([`/my-booking/restaurant/${id}`]);
  }

  protected readonly Math = Math;
}

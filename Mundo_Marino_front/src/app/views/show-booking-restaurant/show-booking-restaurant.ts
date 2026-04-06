import { Component, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Restaurant_reservation } from '../../models/restaurant_reservation';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-show-booking-restaurant',
  imports: [DatePipe, NgClass],
  templateUrl: './show-booking-restaurant.html',
  styleUrl: './show-booking-restaurant.css',
})
export class ShowBookingRestaurant {
  reserva = signal<Restaurant_reservation | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Restaurant_reservation>(`http://127.0.0.1:8000/api/restaurant_reservation/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.reserva.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('No se ha podido cargar la reserva.');
          // this.error.set(err.error?.message ?? err.message ?? 'No se ha podido cargar la reserva.');
          this.loading.set(false);
        }
      });
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      accepted: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
      checked_in: 'En Restaurante',
      late: 'Tarde',
      no_show: 'No Presentado',
    };
    return map[this.reserva()?.status ?? ''] ?? this.reserva()?.status ?? '';
  }

  get statusColor(): string {
    const map: Record<string, string> = {
      pending: 'text-warning',
      accepted: 'text-success',
      cancelled: 'text-danger',
      completed: 'text-info',
      checked_in: 'text-success',
      late: 'text-warning',
      no_show: 'text-secondary',
    };
    return map[this.reserva()?.status ?? ''] ?? 'text-secondary';
  }
}

import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';
import {Restaurant_reservation} from '../../models/restaurant_reservation';

@Component({
  selector: 'app-admin-edit-restaurant-booking',
  imports: [
    AdminNavbar,
    AdminSidebar
  ],
  templateUrl: './admin-edit-restaurant-booking.html',
  styleUrl: './admin-edit-restaurant-booking.css',
})
export class AdminEditRestaurantBooking {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/admin`;

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  reserva = signal<Restaurant_reservation | null>(null);

  reservation_date = signal('');
  reservation_hour = signal('');
  party_size = signal(1);
  status = signal('pending');

  protected readonly Math = Math;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Restaurant_reservation>(`${this.apiUrl}/restaurant_reservation/${id}`, { headers }).subscribe({
      next: (r) => {
        this.reserva.set(r);
        this.reservation_date.set(r.reservation_date ?? '');
        this.reservation_hour.set((r.reservation_hour ?? '').substring(0, 5));
        this.party_size.set(r.party_size ?? 1);
        this.status.set(r.status ?? 'pending');
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

    const payload = {
      reservation_date: this.reservation_date(),
      reservation_hour: this.reservation_hour(),
      party_size:       this.party_size(),
      status:           this.status(),
    };

    this.http.put(`${this.apiUrl}/restaurant_reservation/edit/${id}`, payload, { headers }).subscribe({
      next: () => {
        this.exito.set('Reserva actualizada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/restaurant/bookings']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar la reserva');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/restaurant/bookings']);
  }

  onFechaFiltro(_fecha: string) {}
}

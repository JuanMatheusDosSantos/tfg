import {Component, computed, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Park_reservation} from '../../models/park_reservation';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {Tax} from '../../models/tax';
import {ReservationPrice} from '../../models/reservation-price';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {CurrencyPipe} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-admin-edit-park-booking',
  imports: [
    AdminNavbar,
    AdminSidebar
  ],
  templateUrl: './admin-edit-park-booking.html',
  styleUrl: './admin-edit-park-booking.css',
})
export class AdminEditParkBooking {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/admin`;

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  reserva = signal<Park_reservation | null>(null);
  taxes = signal<Tax[]>([]);
  precios = signal<ReservationPrice[]>([]);

  // Campos del formulario
  reservation_date = signal('');
  adults = signal(1);
  child = signal(0);
  status = signal('pending');
  tax_id = signal(0);
  park_reservation_type_id = signal(0);

  // Precio unitario del tipo seleccionado
  precioSeleccionado = computed(() =>
    this.precios().find(p => p.park_reservation_type_id === this.park_reservation_type_id()) ?? null
  );

  precioUnitario = computed(() =>
    this.precioSeleccionado() ? Math.round(Number(this.precioSeleccionado()!.adult_price) * 100) / 100 : 0
  );

  precioNino = computed(() =>
    this.precioSeleccionado() ? Math.round(Number(this.precioSeleccionado()!.child_price) * 100) / 100 : 0
  );

  adult_price_total = computed(() => Math.round(this.precioUnitario() * this.adults() * 100) / 100);
  child_price_total = computed(() => Math.round(this.precioNino() * this.child() * 100) / 100);

  applied_tax = computed(() => {
    const tax = this.taxes().find(t => t.id === this.tax_id());
    return tax ? tax.percentage : 0;
  });

  total = computed(() => {
    const subtotal = this.adult_price_total() + this.child_price_total();
    return Math.round(subtotal * (1 + this.applied_tax() / 100) * 100) / 100;
  });
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    forkJoin({
      reserva: this.http.get<Park_reservation>(`${this.apiUrl}/park_reservation/${id}`, { headers }),
      taxes:   this.http.get<Tax[]>(`${this.apiUrl}/taxes`, { headers }),
      precios: this.http.get<ReservationPrice[]>(`${this.apiUrl}/park_reservation_prices`, { headers }),
    }).subscribe({
      next: ({ reserva, taxes, precios }) => {
        this.reserva.set(reserva);
        this.taxes.set(taxes);
        this.precios.set(precios);

        // Prellenar formulario
        this.reservation_date.set(reserva.reservation_date);
        this.adults.set(reserva.adults);
        this.child.set(reserva.child);
        this.status.set(reserva.status);
        this.tax_id.set(reserva.tax_id);
        this.park_reservation_type_id.set(reserva.park_reservation_type_id);

        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar la reserva');
        console.log(err.error)
        this.cargando.set(false);
      }
    });
  }

  guardar() {
    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const id = this.reserva()?.id;

    const payload = {
      reservation_date:          this.reservation_date(),
      adults:                    this.adults(),
      child:                     this.child(),
      status:                    this.status(),
      tax_id:                    this.tax_id(),
      park_reservation_type_id:  this.park_reservation_type_id(),
      adult_price_total:         this.adult_price_total(),
      child_price_total:         this.child_price_total(),
      applied_tax:               this.applied_tax(),
    };

    this.http.put(`${this.apiUrl}/park_reservation/${id}`, payload, { headers }).subscribe({
      next: () => {
        this.exito.set('Reserva actualizada correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/park/bookings']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar la reserva');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/park/bookings']);
  }

  onFechaFiltro(_fecha: string) {}

  protected readonly Math = Math;
  increaseAdults() {
    this.adults.update(v => Math.max(1, v + 1));
  }
  decrementAdults() {
    this.adults.update(v => Math.max(1, v - 1));
  }
  increaseChild() {
    this.child.update(v => Math.max(1, v + 1));
  }
  decrementChild() {
    this.child.update(v => Math.max(1, v - 1));
  }

}

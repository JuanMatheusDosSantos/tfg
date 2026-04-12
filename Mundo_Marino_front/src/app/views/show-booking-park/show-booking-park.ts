import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Park_reservation} from '../../models/park_reservation';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-show-booking-park',
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './show-booking-park.html',
  styleUrl: './show-booking-park.css',
})
export class ShowBookingPark implements OnInit{
  reserva = signal<Park_reservation | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private router = inject(Router);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Park_reservation>(`${environment.apiUrl}/park_reservation/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.reserva.set(data);
          this.reserva.set({
            ...data,
            adult_price_total: Number(data.adult_price_total),
            child_price_total: Number(data.child_price_total),
            applied_tax: Number(data.applied_tax),
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se ha podido cargar la reserva.');
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
      checked_in: 'En Parque',
      late: 'Tarde',
      no_show: 'No Presentado',
    };
    return map[this.reserva()?.status ?? ''] ?? this.reserva()?.status ?? '';
  }

  get statusColor(): string {
    const map: Record<string, string> = {
      pending: 'text-amber-600 bg-amber-50',
      accepted: 'text-emerald-600 bg-emerald-50',
      cancelled: 'text-red-600 bg-red-50',
      completed: 'text-sky-600 bg-sky-50',
      checked_in: 'text-emerald-600 bg-emerald-50',
      late: 'text-orange-600 bg-orange-50',
      no_show: 'text-slate-600 bg-slate-100',
    };
    return map[this.reserva()?.status ?? ''] ?? 'text-slate-600 bg-slate-100';
  }

  get total(): number {
    const r = this.reserva();
    if (!r) return 0;
    const subtotal = r.adult_price_total + r.child_price_total;
    return subtotal * (1 + r.applied_tax / 100);
  }

  descargarPDF() {
    const id = this.reserva()?.id;
    window.open(`${environment.apiUrl}/reservation/${id}/pdf`, '_blank');
  }

  protected readonly Number = Number;

  editarReserva() {
    this.router.navigate(['/editParkBooking', this.reserva()?.id]);
  }
  getQrUrl(id: number): string {
    return `${environment.apiUrl}/reservation/${id}/qr`;
  }
}


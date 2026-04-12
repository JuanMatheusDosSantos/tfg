import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

interface ParkReservation {
  id: number;
  user_id: number;
  park_id: number;
  reservation_date: string;
  adults: number;
  child: number;
  status: string;
  codigo_qr: string;
  adult_price_total: number;
  child_price_total: number;
  applied_tax: number;
  user?: { id: number; name: string; email: string; };
}

@Component({
  selector: 'app-admin-park-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, AdminNavbar, AdminSidebar],
  templateUrl: './admin-park-bookings.html',
})
export class AdminParkBookings implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/admin`

  reservas = signal<ParkReservation[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  filtroStatus = signal<string>('all');
  busqueda = signal<string>('');
  fechaFiltro = signal<string>('');

  ngOnInit() {
    this.cargar();
  }

  get totalPendientes() { return this.reservas().filter(r => r.status === 'pending').length; }
  get totalAceptadas()  { return this.reservas().filter(r => r.status === 'accepted').length; }
  get totalHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    return this.reservas().filter(r => r.reservation_date === hoy).length;
  }

  cargar() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<ParkReservation[]>(`${this.apiUrl}/park_reservations`, { headers }).subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar reservas');
        this.cargando.set(false);
      }
    });
  }

  reservasFiltradas = computed(() => {
    let lista = this.reservas();

    if (this.filtroStatus() !== 'all') {
      lista = lista.filter(r => r.status === this.filtroStatus());
    }

    const fecha = this.fechaFiltro();
    if (fecha) {
      lista = lista.filter(r => r.reservation_date === fecha);
    }

    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(r =>
        r.user?.name.toLowerCase().includes(q) ||
        r.id.toString().includes(q)||r.user?.email.includes(q)
      );
    }

    return lista;
  });

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  onFechaFiltro(fecha: string) {
    this.fechaFiltro.set(fecha);
  }

  cambiarStatus(reserva: ParkReservation, nuevoStatus: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(`${this.apiUrl}/park_reservation/${reserva.id}`, { status: nuevoStatus }, { headers })
      .subscribe({
        next: () => {
          this.reservas.update(lista =>
            lista.map(r => r.id === reserva.id ? { ...r, status: nuevoStatus } : r)
          );
        },
        error: (err) => console.error('Error al cambiar status:', err)
      });
  }

  total(r: ParkReservation): number {
    return (Number(r.adult_price_total) + Number(r.child_price_total)) * (1 + Number(r.applied_tax) / 100);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending:    'text-bg-warning',
      accepted:   'text-bg-success',
      checked_in: 'text-bg-success',
      late:       'text-bg-warning',
      no_show:    'text-bg-secondary',
      cancelled:  'text-bg-danger',
      completed:  'text-bg-info',
    };
    return map[status] ?? 'text-bg-secondary';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending:    'Pendiente',
      accepted:   'Aceptada',
      checked_in: 'En Parque',
      late:       'Tarde',
      no_show:    'No Presentado',
      cancelled:  'Cancelada',
      completed:  'Completada',
    };
    return map[status] ?? status;
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
  }
  editarReserva(r: ParkReservation) {
    this.router.navigate(['/admin/park/booking', r.id, 'edit']);
  }

  eliminarReserva(r: ParkReservation) {
    if (!confirm(`¿Eliminar la reserva #MM-${r.id.toString().padStart(7,'0')}?`)) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/park_reservation/${r.id}`, { headers }).subscribe({
      next: () => {
        this.reservas.update(lista => lista.filter(res => res.id !== r.id));
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}

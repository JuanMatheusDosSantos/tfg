import {Component, inject, signal, computed, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Restaurant_reservation} from '../../models/restaurant_reservation';
import {AdminRestaurantBookingService} from '../../components/admin/admin-restaurant-booking';
import {Park} from '../../models/park';
import {Restaurant} from '../../models/restaurant';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-admin-restaurant-bookings',
  imports: [
    AdminSidebar,
    DatePipe
  ],
  templateUrl: './admin-restaurant-bookings.html',
  styleUrl: './admin-restaurant-bookings.css',
})
export class AdminRestaurantBookings implements OnInit {

  private service = inject(AdminRestaurantBookingService);
  private router = inject(Router);
  private auth = inject(AuthService)

  reservas = signal<Restaurant_reservation[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  filtroStatus = signal<string>('all');
  busqueda = signal<string>('');
  fechaFiltro = signal<string>('');

  parks = signal<Park[]>([]);
  restaurants = signal<Restaurant[]>([]);
  filtroPark = signal<number>(0);
  filtroRestaurant = signal<number>(0);

  ngOnInit() {
    this.service.fetchReservas().subscribe({
      next: (data) => {
        if (this.auth.isAdmin) {
          this.reservas.set(data);
        } else {
          this.reservas.set(data.filter(r => r.restaurant?.park_id === this.auth.currentUser()?.park_id));
        }
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar reservas');
        this.cargando.set(false);
      }
    })
    this.service.fetchParks().subscribe({
      next: (data) => this.parks.set(data.sort((a, b) => a.id - b.id)),
      error: () => {}
    });

    this.service.fetchRestaurants().subscribe({
      next: (data) => this.restaurants.set(data),
      error: () => {}
    });
  }

  get totalPendientes() {
    return this.reservas().filter(r => r.status === 'pending').length;
  }

  get totalAceptadas() {
    return this.reservas().filter(r => r.status === 'accepted' || r.status === 'checked_in').length;
  }

  get totalHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    return this.reservas().filter(r => r.reservation_date === hoy).length;
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
    const parkId = this.filtroPark();
    const restaurantId = this.filtroRestaurant();

    if (restaurantId !== 0) {
      lista = lista.filter(r => r.restaurant_id === restaurantId);
    } else if (parkId !== 0) {
      const restaurantIds = this.restaurants()
        .filter(r => r.park_id === parkId)
        .map(r => r.id);
      lista = lista.filter(r => restaurantIds.includes(r.restaurant_id));
    }

    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(r =>
        r?.user?.name?.toLowerCase().includes(q) ||
        r?.user?.email?.toLowerCase().includes(q) ||
        r.id?.toString().padStart(7,'0').includes(q) ||
        `mm-${r.id?.toString().padStart(7,'0')}`.includes(q) ||
        r.reservation_date?.includes(q) ||
        r.reservation_hour?.substring(0,5).includes(q) ||
       ( r.party_size+" personas")?.toString().includes(q)
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

  cambiarStatus(reserva: Restaurant_reservation, nuevoStatus: string) {
    this.service.cambiarStatus(reserva, nuevoStatus).subscribe({
      next: () => {
        this.reservas.update(lista =>
          lista.map(r => r.id === reserva.id ? {...r, status: nuevoStatus} : r)
        );
      },
      error: (err) => console.error('Error al cambiar status:', err)
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'text-bg-warning',
      accepted: 'text-bg-success',
      checked_in: 'text-bg-success',
      late: 'text-bg-warning',
      no_show: 'text-bg-secondary',
      cancelled: 'text-bg-danger',
      completed: 'text-bg-info',
    };
    return map[status] ?? 'text-bg-secondary';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      accepted: 'Aceptada',
      checked_in: 'En Restaurante',
      late: 'Tarde',
      no_show: 'No Presentado',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return map[status] ?? status;
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
  }

  editarReserva(r: Restaurant_reservation) {
    this.router.navigate(['/admin/restaurant/booking', r.id, 'edit']);
  }

  eliminarReserva(r: Restaurant_reservation) {
    if (!confirm(`¿Eliminar la reserva #MM-${r.id?.toString().padStart(7, '0')}?`)) return;

    this.service.delete(r.id!).subscribe({
      next: () => {
        this.reservas.update(lista => lista.filter(res => res.id !== r.id));
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  restaurantesFiltradosPorParque = computed(() => {
    const parkId = this.filtroPark();
    if (parkId === 0) return this.restaurants();
    return this.restaurants().filter(r => r.park_id === parkId);
  });

  onParkChange(id: number) {
    this.filtroPark.set(id);
    this.filtroRestaurant.set(0);
  }

}

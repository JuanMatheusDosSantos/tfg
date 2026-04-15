import {Component, computed, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth';
import {CommonModule, CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CurrencyPipe, DatePipe, DecimalPipe, AdminNavbar, AdminSidebar],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.html',
})
export class AdminHome {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}`;

  stats = signal<any>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  fechaFiltro = signal<string>('');

  get role(): string {
    return (this.auth as any).currentUser()?.role ?? '';
  }

  // get esAdmin()       { return this.role === 'admin'; }
  // get esParque()      { return this.role === 'park'  || this.role === 'admin'; }
  // get esRestaurante() { return this.role === 'restaurant' || this.role === 'admin'; }

  ngOnInit() {
    this.cargarStats();
  }

  cargarStats() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/admin/stats`, { headers }).subscribe({
      next: (data) => {
        this.stats.set(data);
        // console.log(data)
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? err.message ?? 'No se ha podido cargar las estadisticas.');
        console.error('Error en logout', err);
        this.cargando.set(false);
      }
    });
  }

  onFechaFiltro(fecha: string) {
    this.fechaFiltro.set(fecha);
  }

  reservasParqueFiltradas = computed(() => {
    const fecha = this.fechaFiltro();
    const reservas = this.stats()?.ultimas_reservas_parque ?? [];
    if (!fecha) return reservas;
    return reservas.filter((r: any) => r.reservation_date === fecha);
  });

  reservasRestauranteFiltradas = computed(() => {
    const fecha = this.fechaFiltro();
    const reservas = this.stats()?.ultimas_reservas_restaurante ?? [];
    if (!fecha) return reservas;
    return reservas.filter((r: any) => r.reservation_date === fecha);
  });

  variacionClass(valor: number): string {
    return valor >= 0 ? 'text-success' : 'text-danger';
  }

  variacionIcon(valor: number): string {
    return valor >= 0 ? 'arrow_upward' : 'arrow_downward';
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
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
      paid:"text-bg-success"
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
      paid:"Pagado"
    };
    return map[status] ?? status;
  }

  isAdmin(){
    return this.auth.isAdmin
  }

  isPark(){
    return this.auth.isPark
  }

  isRestaurant(){
    return this.auth.isRestaurant
  }
}

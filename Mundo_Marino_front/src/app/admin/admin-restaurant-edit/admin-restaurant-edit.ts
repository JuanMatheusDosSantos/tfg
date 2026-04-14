import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {Restaurant} from '../../models/restaurant';

@Component({
  selector: 'app-admin-restaurant-edit',
  imports: [
    AdminNavbar,
    AdminSidebar
  ],
  templateUrl: './admin-restaurant-edit.html',
  styleUrl: './admin-restaurant-edit.css',
})
export class AdminRestaurantEdit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}`;

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  reserva = signal<Restaurant | null>(null);

  name = signal('');
  max_capacity = signal(1);
  opening_time = signal('');
  closing_time = signal('');

  protected readonly Math = Math;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<Restaurant>(`${this.apiUrl}/admin/restaurant/${id}`, { headers }).subscribe({
      next: (r) => {
        this.reserva.set(r);
        this.name.set(r.name ?? '');
        this.max_capacity.set(r.max_capacity ?? 1);
        this.opening_time.set((r.opening_time ?? '').substring(0, 5));
        this.closing_time.set((r.closing_time ?? '').substring(0, 5));
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar el restaurante');
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
      name: this.name(),
      max_capacity: this.max_capacity(),
      opening_time: this.opening_time(),
      closing_time: this.closing_time(),
      park_id: this.reserva()?.park_id ?? 1,
    };

    this.http.put(`${this.apiUrl}/admin/restaurant/${id}`, body, { headers }).subscribe({
      next: () => {
        this.exito.set('Restaurante actualizado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/restaurant']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al guardar el restaurante');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/restaurant']);
  }

  onFechaFiltro(_fecha: string) {}
}

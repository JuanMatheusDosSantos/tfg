import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-admin-new-restaurant',
  imports: [
    AdminSidebar
  ],
  templateUrl: './admin-new-restaurant.html',
  styleUrl: './admin-new-restaurant.css',
})
export class AdminNewRestaurant {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/admin`;

  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  name = signal('');
  max_capacity = signal(1);
  opening_time = signal('');
  closing_time = signal('');
  park_id = signal(1);

  protected readonly Math = Math;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  guardar() {
    if (!this.name()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    this.http.post(`${this.apiUrl}/restaurant`, {
      name:         this.name(),
      max_capacity: this.max_capacity(),
      opening_time: this.opening_time(),
      closing_time: this.closing_time(),
      park_id:      this.park_id(),
    }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.exito.set('Restaurante creado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/restaurant']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el restaurante');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/restaurant']);
  }

  onFechaFiltro(_fecha: string) {}
}

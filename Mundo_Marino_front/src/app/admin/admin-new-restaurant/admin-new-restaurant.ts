import {Component, inject, OnInit, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';
import {Park} from '../../models/park';
import {AdminRestaurantService} from '../../components/admin/admin-restaurant';

@Component({
  selector: 'app-admin-new-restaurant',
  imports: [
    AdminSidebar
  ],
  templateUrl: './admin-new-restaurant.html',
  styleUrl: './admin-new-restaurant.css',
})
export class AdminNewRestaurant implements OnInit{

  private service = inject(AdminRestaurantService);

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

  parks = signal<Park[]>([]);

  protected readonly Math = Math;

  ngOnInit() {
    this.service.fetchParks().subscribe({
      next: (data) => {
        this.parks.set(data.sort((a, b) => a.id - b.id));
        if (data.length) this.park_id.set(data[0].id);
      },
      error: () => {}
    });
  }

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

    this.service.create({
      name:         this.name(),
      max_capacity: this.max_capacity(),
      opening_time: this.opening_time(),
      closing_time: this.closing_time(),
      park_id:      this.park_id(),
    }).subscribe({
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

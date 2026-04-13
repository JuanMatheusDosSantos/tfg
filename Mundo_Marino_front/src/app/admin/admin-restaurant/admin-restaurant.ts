import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbar } from '../../layouts/admin-navbar/admin-navbar';
import { AdminSidebar } from '../../layouts/admin-sidebar/admin-sidebar';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../../models/restaurant';
import {AdminRestaurantService} from '../../components/admin/admin-restaurant';

@Component({
  selector: 'app-admin-restaurant',
  imports: [AdminNavbar, AdminSidebar, RouterLink],
  templateUrl: './admin-restaurant.html',
  styleUrl: './admin-restaurant.css',
})
export class AdminRestaurant {
  private service = inject(AdminRestaurantService);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  restaurants = signal<Restaurant[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  busqueda = signal<string>('');

  ngOnInit() {
    this.service.fetchRestaurants().subscribe({
      next: (data) => {
        this.restaurants.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar los restaurantes');
        this.cargando.set(false);
      }
    });
  }

  restaurantesFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.restaurants();
    return this.restaurants().filter(r =>
      r.name?.toLowerCase().includes(q)
    );
  });

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  onFechaFiltro(_fecha: string) {}

  delete(r: Restaurant) {
    if (!confirm(`¿Eliminar el restaurante ${r.name}?`)) return;

    this.service.delete(r.id!).subscribe({
      next: () => {
        this.restaurants.update(list => list.filter(res => res.id !== r.id));
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}

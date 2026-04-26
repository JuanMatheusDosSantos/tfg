import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbar } from '../../layouts/admin-navbar/admin-navbar';
import { AdminSidebar } from '../../layouts/admin-sidebar/admin-sidebar';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../../models/restaurant';
import {AdminRestaurantService} from '../../components/admin/admin-restaurant';
import {Park} from '../../models/park';

@Component({
  selector: 'app-admin-restaurant',
  imports: [AdminSidebar, RouterLink],
  templateUrl: './admin-restaurant.html',
  styleUrl: './admin-restaurant.css',
})
export class AdminRestaurant {
  private service = inject(AdminRestaurantService);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  errorDelete = signal<string | null>(null);

  restaurants = signal<Restaurant[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  busqueda = signal<string>('');

  parks = signal<Park[]>([]);
  filtroPark = signal<number>(0);

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
    this.service.fetchParks().subscribe({
      next: (data) => this.parks.set(data.sort((a, b) => a.id - b.id)),
      error: () => {}
    });
  }

  restaurantesFiltrados = computed(() => {
    let lista = this.restaurants();

    const parkId = this.filtroPark();
    if (parkId !== 0) {
      lista = lista.filter(r => r.park_id === parkId);
    }

    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(r => r.name?.toLowerCase().includes(q));
    }

    return lista;
  });

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  onFechaFiltro(_fecha: string) {}

  delete(r: Restaurant) {
    if (!confirm(`¿Eliminar el restaurante ${r.name}?`)) return;

    this.errorDelete.set(null);
    this.service.delete(r.id!).subscribe({
      next: () => {
        this.restaurants.update(list => list.filter(res => res.id !== r.id));
      },
      error: (err) => this.errorDelete.set(err.error?.message ?? 'Error al eliminar el restaurante')
    });
  }
}

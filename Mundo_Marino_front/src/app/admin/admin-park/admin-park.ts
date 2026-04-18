import {Component, computed, inject, signal} from '@angular/core';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {RouterLink} from '@angular/router';
import {AdminParkService} from '../../components/admin/admin-parks';

@Component({
  selector: 'app-admin-park',
  imports: [AdminSidebar, RouterLink],
  templateUrl: './admin-park.html',
  styleUrl: './admin-park.css',
})
export class AdminPark {

  private service = inject(AdminParkService);

  parks = this.service.parks;
  cargando = signal(true);
  error = signal<string | null>(null);
  busqueda = signal('');

  ngOnInit() {
    this.service.fetchParks().subscribe({
      next: () => this.cargando.set(false),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar los parques');
        this.cargando.set(false);
      }
    });
  }

  parksFiltrados = computed(() => {
    const q = this.busqueda().toLowerCase();
    if (!q) return this.parks();
    return this.parks().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  onFechaFiltro(_fecha: string) {}
}

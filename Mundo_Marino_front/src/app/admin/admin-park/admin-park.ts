import {Component, computed, inject, signal} from '@angular/core';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {RouterLink} from '@angular/router';
import {AdminParkService} from '../../components/admin/admin-parks';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-admin-park',
  imports: [AdminSidebar, RouterLink],
  templateUrl: './admin-park.html',
  styleUrl: './admin-park.css',
})
export class AdminPark {

  private service = inject(AdminParkService);
private auth=inject(AuthService)
  parks = this.service.parks;
  cargando = signal(true);
  error = signal<string | null>(null);
  busqueda = signal('');

  ngOnInit() {
    this.service.fetchParks().subscribe({
      next: (data) => {
        console.log('isAdmin:', this.auth.isAdmin);
        console.log('currentUser:', this.auth.currentUser());
        console.log('data:', data);
        const sorted = data.sort((a, b) => a.id - b.id);
        if (this.auth.isAdmin) {
          this.parks.set(sorted);
        } else {
          this.parks.set(sorted.filter(p => p?.id === this.auth.currentUser()?.park?.id));
        }
        this.cargando.set(false);
      },
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

  isAdmin(){
    return this.auth.isAdmin;
  }
}

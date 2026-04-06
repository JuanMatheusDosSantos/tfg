import {Component, computed, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Park} from '../../models/park';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-park',
  imports: [
    AdminNavbar,
    AdminSidebar
  ],
  templateUrl: './admin-park.html',
  styleUrl: './admin-park.css',
})
export class AdminPark {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/admin';

  park = signal<Park | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  filtroStatus = signal<string>('all');
  busqueda = signal<string>('');

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Asumimos parque con id 1, ajusta según tu lógica
    this.http.get<Park>(`${this.apiUrl}/park/1`, { headers }).subscribe({
      next: (data) => {
        this.park.set(data);
        console.log(data)
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar el parque');
        this.cargando.set(false);
      }
    });
  }

  atraccionesFiltradas = computed(() => {
    const park = this.park();
    if (!park) return [];
    console.log('Status de atracciones:', park.attractions.map(a => a.status));
    console.log('Filtro actual:', this.filtroStatus());

    let lista = park.attractions;
    if (this.filtroStatus() !== 'all') {
      lista = lista.filter(a => a.status === this.filtroStatus());
    }
    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(a => a.name.toLowerCase().includes(q));
    }
    return lista;
  });

  setFiltro(status: string) {
    this.filtroStatus.set(status);
  }

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      operational: 'text-bg-success',
      maintenance: 'text-bg-warning',
      closed:      'text-bg-danger',
    };
    return map[status] ?? 'text-bg-secondary';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      operational: 'Operativa',
      maintenance: 'Mantenimiento',
      closed:      'Cerrada',
    };
    return map[status] ?? status;
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      suave:    'Suave',
      moderado: 'Moderado',
      intenso:  'Intenso',
    };
    return map[tipo] ?? tipo;
  }

  tipoClass(tipo: string): string {
    const map: Record<string, string> = {
      suave:    'text-bg-info',
      moderado: 'text-bg-warning',
      intenso:  'text-bg-danger',
    };
    return map[tipo] ?? 'text-bg-secondary';
  }

  onFechaFiltro(_fecha: string) {}
}

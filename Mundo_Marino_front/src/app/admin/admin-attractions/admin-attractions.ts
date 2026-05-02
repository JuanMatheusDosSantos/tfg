import {Component, computed, inject, signal} from '@angular/core';
import {AdminSidebar} from "../../layouts/admin-sidebar/admin-sidebar";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Park} from '../../models/park';
import {Attraction} from '../../models/attraction';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../auth/auth';
import {ParkService} from '../../components/park';
import {AttractionService} from '../../components/attraction';

@Component({
  selector: 'app-admin-attractions',
  imports: [AdminSidebar, RouterLink],
  templateUrl: './admin-attractions.html',
  styleUrl: './admin-attractions.css',
})
export class AdminAttractions {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;
  private auth = inject(AuthService);
  private service = inject(ParkService);
  private attractionService = inject(AttractionService);

  parks = signal<Park[]>([]);
  parkSeleccionado = signal<number>(0);
  park = signal<Park | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  filtroStatus = signal<string>('all');
  busqueda = signal<string>('');

  paginaActual = signal(1);
  readonly POR_PAGINA = 10;

  readonly DEFAULT_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsEt5IDp4eM3zxQA_qXlmCTKvlR_kWL1l9nQ2uAotEcuvEHEggiUvGBRn8Qwx3jKLnhW2Frj7gBCi8egjueurnHnF5NkqrZJVILn4VPbo2afG-zyvZIfgsBrnRoe-MkMQjdJc5TdAsseFh8rB6HqJRlcWdDoXQTC0wFvNMSPGk-PbMcW7orrjtyDQEJqvTiaUzLAAZMGQ-4ldr4OtJZ1o3DoKPpGWdAt5NNDOocklyDyvny298A7zwtA0g4mIhwnjsWyl__BA4arG';
  imgUrl = `${environment.imgUrl}`;

  ngOnInit() {
    this.cargarParks();
  }

  cargarParks() {
    this.service.fetchParks().subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => a.id - b.id);
        if (this.isAdmin()) {
          this.parks.set(sorted);
        } else {
          this.parks.set(sorted.filter(p => p.id === this.auth.currentUser()?.park?.id));
        }
        this.cargarAtracciones();
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar los parques');
        this.cargando.set(false);
      }
    });
  }

  cargarAtracciones() {
    this.attractionService.fetchAttractions().subscribe({
      next: (atracciones) => {
        const filtered = this.isAdmin()
          ? atracciones
          : atracciones.filter(a => a.park?.id === this.auth.currentUser()?.park?.id);

        this.parks.update(parks =>
          parks.map(p => ({
            ...p,
            attractions: filtered.filter(a => a.park?.id === p.id)
          }))
        );
        this.cargando.set(false); // ← aquí sí
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar las atracciones');
        this.cargando.set(false);
      }
    });
  }

  onParkChange(id: number) {
    this.parkSeleccionado.set(id);
    this.paginaActual.set(1);
  }

  atraccionesFiltradas = computed(() => {
    const parkId = this.parkSeleccionado();
    const parks = this.parks();

    let lista = parkId === 0
      ? parks.flatMap(p => p.attractions ?? [])
      : (parks.find(p => p.id === parkId)?.attractions ?? []);

    if (this.filtroStatus() !== 'all') {
      lista = lista.filter(a => a.status === this.filtroStatus());
    }

    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        (a.duration.toString() + ' min').toLowerCase().includes(q) ||
        (a.max_capacity.toString() + ' personas').toLowerCase().includes(q)
      );
    }

    return lista;
  });

  setFiltro(status: string) {
    this.filtroStatus.set(status);
    this.paginaActual.set(1);
  }

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
    this.paginaActual.set(1);
  }


  statusClass(status: string): string {
    const map: Record<string, string> = {
      operational: 'text-bg-success',
      maintenance: 'text-bg-warning',
      closed: 'text-bg-danger',
      permanently_closed: 'text-bg-danger'
    };
    return map[status] ?? 'text-bg-secondary';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      operational: 'Operativa',
      maintenance: 'Mantenimiento',
      closed: 'Cerrada',
      permanently_closed: 'Permanentemente cerrado'
    };
    return map[status] ?? status;
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      suave: 'Suave',
      moderado: 'Moderado',
      intenso: 'Intenso',
    };
    return map[tipo] ?? tipo;
  }

  tipoClass(tipo: string): string {
    const map: Record<string, string> = {
      suave: 'text-bg-info',
      moderado: 'text-bg-warning',
      intenso: 'text-bg-danger',
    };
    return map[tipo] ?? 'text-bg-secondary';
  }

  cambiarStatus(atraccion: Attraction, nuevoStatus: string) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});

    this.http.put(`${this.apiUrl}/attraction/status/${atraccion.id}`,
      {
        name: atraccion.name,
        type: atraccion.type,
        duration: atraccion.duration,
        max_capacity: atraccion.max_capacity,
        park_id: atraccion.park?.id ?? 1,
        status: nuevoStatus
      },
      {headers}
    ).subscribe({
      next: () => {
        this.parks.update(lista =>
          lista.map(p => ({
            ...p,
            attractions: p.attractions.map(a =>
              a.id === atraccion.id ? {...a, status: nuevoStatus as any} : a
            )
          }))
        );
      },
      error: (err) => console.error('Error al cambiar status:', err)
    });
  }

  delete(a: Attraction) {
    if (!confirm(`¿Quieres que la atracción ${a.name} pase a estar permanentemente cerrada?`)) return;

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});

    this.http.delete(`${this.apiUrl}/attraction/${a.id}`, {headers}).subscribe({
      next: () => this.cargarParks(),
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  parkActual = computed(() =>
    this.parkSeleccionado() === 0
      ? null
      : this.parks().find(p => p.id === this.parkSeleccionado()) ?? null
  );

  isAdmin() {
    return this.auth.isAdmin;
  }

  imagenAtraccion(a: Attraction): string {
    return a.image ? `${a.image}` : this.DEFAULT_IMAGE;
  }

  atraccionesPaginadas = computed(() => {
    const lista = this.atraccionesFiltradas();
    const inicio = (this.paginaActual() - 1) * this.POR_PAGINA;
    return lista.slice(inicio, inicio + this.POR_PAGINA);
  });

  totalPaginas = computed(() =>
    Math.ceil(this.atraccionesFiltradas().length / this.POR_PAGINA)
  );

  irAPagina(p: number) {
    this.paginaActual.set(p);
  }
}

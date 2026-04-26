import {Component, computed, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AdminNavbar} from '../../layouts/admin-navbar/admin-navbar';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {environment} from '../../../environments/environment';
import {CommonModule, DatePipe} from '@angular/common';
import {AdminLog} from '../../models/admin-log';
import {Router} from '@angular/router';


@Component({
  selector: 'app-admin-logs',
  imports: [AdminSidebar, DatePipe, CommonModule],
  templateUrl: './admin-logs.html',
  styleUrl: './admin-logs.css',
})
export class AdminLogs {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;
private route=inject(Router);

  logs = signal<AdminLog[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  busqueda = signal('');
  filtroAccion = signal('all');

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<AdminLog[]>(`${this.apiUrl}/admin_logs`, { headers }).subscribe({
      next: (data) => {
        this.logs.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar los logs');
        this.cargando.set(false);
      }
    });
  }

  get totalLogs()    { return this.logs().length; }
  get totalInserts() { return this.logs().filter(l => l.action?.toLowerCase() === 'insert').length; }
  get totalUpdates() { return this.logs().filter(l => l.action?.toLowerCase() === 'update').length; }
  get totalDeletes() { return this.logs().filter(l => l.action?.toLowerCase() === 'delete').length; }

  logsFiltrados = computed(() => {
    let lista = this.logs();

    if (this.filtroAccion() !== 'all') {
      lista = lista.filter(l => l.action?.toLowerCase() === this.filtroAccion());
    }

    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(l =>
        l.user?.name?.toLowerCase().includes(q) ||
        l.action?.toLowerCase().includes(q) ||
        l.affected_table?.toLowerCase().includes(q) ||
        l.id.toString().includes(q)
      );
    }

    return lista.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  accionClass(accion: string): string {
    const map: Record<string, string> = {
      insert: 'text-bg-success',
      update: 'text-bg-warning',
      delete: 'text-bg-danger',
    };
    return map[accion?.toLowerCase()] ?? 'text-bg-secondary';
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
  }

  onFechaFiltro(_fecha: string) {}

  verLog(id:number){
    this.route.navigate([`/admin/log/${id}`])
  }
}

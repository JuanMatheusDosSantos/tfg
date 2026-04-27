import {Component, computed, inject, signal} from '@angular/core';
import {AdminUsersService} from '../../components/admin/admin-user';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {User} from '../../models/user';

@Component({
  selector: 'app-admin-users',
  imports: [AdminSidebar, RouterLink, DatePipe],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers {
  private service = inject(AdminUsersService);

  users = this.service.users;
  cargando = signal(true);
  error = signal<string | null>(null);
  busqueda = signal('');
  filtroRole = signal('all');

  ngOnInit() {
    this.service.fetchUsers().subscribe({
      next: () => this.cargando.set(false),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar usuarios');
        this.cargando.set(false);
      }
    });
  }

  usuariosFiltrados = computed(() => {
    let lista = this.users();

    if (this.filtroRole() !== 'all') {
      lista = lista.filter(u => u.role === this.filtroRole());
    }

    const q = this.busqueda().toLowerCase();
    if (q) {
      lista = lista.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toString().includes(q)
      );
    }

    return lista;
  });

  onBusqueda(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
  }

  delete(u: User) {
    if (!confirm(`¿Eliminar el usuario ${u.name}?`)) return;

    this.service.delete(u.id).subscribe({
      next: () => {},
      error: (err) => this.error.set(err.error?.message ?? 'Error al eliminar')
    });
  }

  onFechaFiltro(_fecha: string) {}

  guardarRol(u: User, nuevoRol: string) {
    this.service.updateRole(u.id, nuevoRol).subscribe({
      next: () => {
        this.users.update(lista =>
          lista.map(x => x.id === u.id ? { ...x, role: nuevoRol } : x)
        );
      },
      error: (err) => this.error.set(err.error?.message ?? 'Error al actualizar rol')
    });
  }

  get totalAdmins()      { return this.users().filter(u => u.role === 'admin').length; }
  get totalRestaurant()  { return this.users().filter(u => u.role === 'restaurant').length; }
  get totalPark()        { return this.users().filter(u => u.role === 'park').length; }
}

import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {AdminUsersService} from '../../components/admin/admin-user';
import {User} from '../../models/user';

@Component({
  selector: 'app-admin-user-edit',
  imports: [AdminSidebar],
  templateUrl: './admin-user-edit.html',
  styleUrl: './admin-user-edit.css',
})
export class AdminUserEdit {
  private service = inject(AdminUsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  usuario = signal<User | null>(null);

  name = signal('');
  email = signal('');
  phone = signal<number | undefined>(undefined);
  role = signal('user');

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.service.fetchUsers().subscribe({
      next: () => {
        const u = this.service.users().find(x => x.id === id);
        if (u) {
          this.usuario.set(u);
          this.name.set(u.name);
          this.email.set(u.email);
          this.phone.set(u.phone ?? undefined);
          this.role.set(u.role);
        }
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al cargar el usuario');
        this.cargando.set(false);
      }
    });
  }

  guardar() {
    if (!this.name() || !this.email()) {
      this.error.set('Nombre y email son obligatorios.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    this.service.update(this.usuario()!.id, {
      name:  this.name(),
      email: this.email(),
      phone: this.phone(),
      role:  this.role(),
    }).subscribe({
      next: () => {
        this.exito.set('Usuario actualizado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al actualizar el usuario');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/users']);
  }
}

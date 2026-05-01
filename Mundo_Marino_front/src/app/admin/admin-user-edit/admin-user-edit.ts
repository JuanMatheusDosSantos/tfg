import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {AdminUsersService} from '../../components/admin/admin-user';
import {User} from '../../models/user';
import {AdminParkService} from '../../components/admin/admin-parks';
import {AdminRestaurantService} from '../../components/admin/admin-restaurant';
import {Park} from '../../models/park';
import {Restaurant} from '../../models/restaurant';

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
  private parkService    = inject(AdminParkService);
  private restService    = inject(AdminRestaurantService);

  cargando = signal(true);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  usuario = signal<User | null>(null);

  name = signal('');
  email = signal('');
  phone = signal<number | undefined>(undefined);
  role = signal('user');

  parks       = signal<Park[]>([]);
  restaurants = signal<Restaurant[]>([]);

  selectedParkId       = signal<number | null>(null);
  selectedRestaurantId = signal<number | null>(null);

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;

    this.parkService.fetchParks().subscribe(parks => this.parks.set(parks));

    this.service.fetchUsers().subscribe({
      next: () => {
        const u = this.service.users().find(x => x.id === id);
        if (u) {
          this.usuario.set(u);
          this.name.set(u.name);
          this.email.set(u.email);
          this.phone.set(u.phone ?? undefined);
          this.role.set(u.role);

          if (u.park?.id) {
            this.selectedParkId.set(u.park.id);
          }

          this.restService.fetchRestaurants().subscribe(res => {
            const lista = Array.isArray(res) ? res : (res as any)?.data ?? [];
            this.restaurants.set(lista);

            if (u.restaurant?.id) {
              this.selectedRestaurantId.set(u.restaurant.id);
            }
          });
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

    const role = this.role();

    if (role === 'park' && !this.selectedParkId()) {
      this.error.set('Debes seleccionar un parque.');
      return;
    }
    if (role === 'restaurant' && !this.selectedRestaurantId()) {
      this.error.set('Debes seleccionar un restaurante.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);
    this.error.set(null);

    const payload: any = {
      name:  this.name(),
      email: this.email(),
      phone: this.phone(),
      role,
    };

    if (role === 'park'||role === 'restaurant') {
      payload['park_id'] = this.selectedParkId();
    }
    if (role === 'restaurant') {
      payload['restaurant_id'] = this.selectedRestaurantId();
    }

    this.service.update(this.usuario()!.id, payload).subscribe({
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

  filteredRestaurants = computed(() => {
    const pid = this.selectedParkId();
    if (pid === null) return [];
    console.log(this.restaurants)
    return this.restaurants().filter(r => r.park_id === pid);
  });

  onRoleChange(value: string) {
    this.role.set(value);
    this.selectedParkId.set(null);
    this.selectedRestaurantId.set(null);
  }

  onParkChange(value: string) {
    this.selectedParkId.set(value ? +value : null);
    this.selectedRestaurantId.set(null);
  }

  volver() {
    this.router.navigate(['/admin/users']);
  }
}

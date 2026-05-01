import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AdminSidebar} from '../../layouts/admin-sidebar/admin-sidebar';
import {AdminUsersService} from '../../components/admin/admin-user';
import {AdminParkService} from '../../components/admin/admin-parks';
import {AdminRestaurantService} from '../../components/admin/admin-restaurant';
import {Park} from '../../models/park';
import {Restaurant} from '../../models/restaurant';

@Component({
  selector: 'app-admin-new-user',
  imports: [AdminSidebar],
  templateUrl: './admin-new-user.html',
  styleUrl: './admin-new-user.css',
})
export class AdminNewUser {
  private service     = inject(AdminUsersService);
  private router      = inject(Router);
  private parkService = inject(AdminParkService);
  private restService = inject(AdminRestaurantService);

  cargando  = signal(false);
  guardando = signal(false);
  error     = signal<string | null>(null);
  exito     = signal<string | null>(null);

  name     = signal('');
  email    = signal('');
  phone    = signal<number | undefined>(undefined);
  role     = signal('user');
  password = signal('');
  birthdate = signal('');

  parks       = signal<Park[]>([]);
  restaurants = signal<Restaurant[]>([]);

  selectedParkId       = signal<number | null>(null);
  selectedRestaurantId = signal<number | null>(null);

  ngOnInit() {
    this.parkService.fetchParks().subscribe(parks => this.parks.set(parks));
    this.restService.fetchRestaurants().subscribe(res => {
      const lista = Array.isArray(res) ? res : (res as any)?.data ?? [];
      this.restaurants.set(lista);
    });
  }

  filteredRestaurants = computed(() => {
    const pid = this.selectedParkId();
    if (pid === null) return [];
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

  guardar() {
    if (!this.name() || !this.email() || !this.password() || !this.birthdate()) {
      this.error.set('Nombre, email, contraseña y fecha de nacimiento son obligatorios.');
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
      name:      this.name(),
      email:     this.email(),
      phone:     this.phone(),
      role,
      password:  this.password(),
      birthdate: this.birthdate(),
    };

    if (role === 'park' || role === 'restaurant') {
      payload['park_id'] = this.selectedParkId();
    }
    if (role === 'restaurant') {
      payload['restaurant_id'] = this.selectedRestaurantId();
    }

    this.service.create(payload).subscribe({
      next: () => {
        this.exito.set('Usuario creado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al crear el usuario');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/users']);
  }
}

import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../auth/auth';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
  private authService = inject(AuthService);

  get role(): string {
    return (this.authService as any).currentUser()?.role ?? '';
  }

  get esAdmin()       { return this.role === 'admin'; }
  get esParque()      { return this.role === 'park'  || this.role === 'admin'; }
  get esRestaurante() { return this.role === 'restaurant' || this.role === 'admin'; }

  parqueAbierto = signal(false);

  toggleParque() {
    this.parqueAbierto.update(v => !v);
  }
}

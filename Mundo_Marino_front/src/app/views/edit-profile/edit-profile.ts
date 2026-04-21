import {Component, inject, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  imports: [],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  cargando = signal(false);
  guardando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);

  user = this.authService.currentUser;

  name = signal(this.user()?.name ?? '');
  email = signal(this.user()?.email ?? '');
  phone = signal<number | undefined>(this.user()?.phone ?? undefined);

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  guardar() {
    this.error.set(null);

    if (!this.name()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    if (this.phone() !== undefined && this.phone()!.toString().length !== 9) {
      this.error.set('El teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    this.guardando.set(true);
    this.exito.set(null);

    this.authService.updateProfile({
      name:  this.name(),
      email: this.email(),
      phone: this.phone(),
    }).subscribe({
      next: () => {
        this.exito.set('Perfil actualizado correctamente.');
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/profile']), 1500);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al actualizar el perfil');
        this.guardando.set(false);
      }
    });
  }

  volver() {
    this.router.navigate(['/profile']);
  }
}

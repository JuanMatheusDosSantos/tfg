import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;

  ngOnInit() {
    this.authService.loadUserIfNeeded();
  }

  editarPerfil() {
    this.router.navigate(['/profile/edit']);
  }

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      admin:      'Administrador',
      park:       'Parque',
      restaurant: 'Restaurante',
      user:       'Usuario',
    };
    return map[role] ?? role;
  }

  iniciales(nombre: string): string {
    return nombre?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}

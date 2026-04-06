import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-navbar.html',
})
export class AdminNavbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() fechaFiltro = new EventEmitter<string>();

  user = this.authService.user$;

  onFechaChange(fecha: string) {
    this.fechaFiltro.emit(fecha);
  }
}

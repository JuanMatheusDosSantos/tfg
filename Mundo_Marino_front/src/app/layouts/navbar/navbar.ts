import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);

  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;
  private router:  Router = inject(Router);
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Solo navegamos CUANDO el servidor responda que el logout fue OK
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Si el servidor da error, navegamos de todos modos para que el usuario no se quede bloqueado
        console.error('Error en logout', err);
        this.router.navigate(['/']);
      }
    });
  }
}

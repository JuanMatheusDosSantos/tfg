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
  private auth = inject(AuthService);

  public currentUser = this.auth.currentUser;
  public isLoggedIn = this.auth.isLoggedIn;
  private router:  Router = inject(Router);
  logout() {
    this.auth.logout().subscribe({
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
  // alertLogin() {
  //   alert('¡Atención! Tienes que iniciar sesión para poder realizar una reserva.');
  //   this.router.navigate(['/login']);
  // }
  isAdmin(){
    return this.auth.isAdmin
  }

  isPark(){
    return this.auth.isPark
  }

  isRestaurant(){
    return this.auth.isRestaurant
  }
}

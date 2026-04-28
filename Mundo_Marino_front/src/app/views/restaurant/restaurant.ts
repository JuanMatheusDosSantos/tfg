import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-restaurant',
  imports: [],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.css',
})
export class Restaurant {

  private route = inject(Router)


  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;
  restaurante = `${environment.imgUrl}/storage/img/restaurante_tfg.png`

  irAReserva() {
    this.route.navigate(["/booking"])
  }
}


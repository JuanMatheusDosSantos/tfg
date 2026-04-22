import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-restaurant',
  imports: [],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.css',
})
export class Restaurant {

  private route=inject(Router)


  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;

  irAReserva(){
    this.route.navigate(["/booking"])
  }
}


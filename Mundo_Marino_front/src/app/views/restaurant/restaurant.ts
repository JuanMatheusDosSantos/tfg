import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-restaurant',
  imports: [],
  templateUrl: './restaurant.html',
  styleUrl: './restaurant.css',
})
export class Restaurant {

  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;
}


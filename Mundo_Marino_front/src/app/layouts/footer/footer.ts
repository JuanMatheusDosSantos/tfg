import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  private auth = inject(AuthService);

  public currentUser = this.auth.currentUser;
  public isLoggedIn = this.auth.isLoggedIn;


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

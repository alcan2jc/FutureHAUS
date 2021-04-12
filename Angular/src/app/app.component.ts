import { Component } from '@angular/core';
// import {AuthService} from './_services/auth.service';
import { Router } from '@angular/router';
import { User } from './_models/user';
// import {Role} from './_models/role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FutureHAUS';
  currentUser: User;

  constructor(private router: Router
    // private authService: AuthService
  ) {
    this.router.navigate(['/login']);
    // this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isUser() {
    return this.currentUser;
  }

  logout() {
    // this.authService.logout();
    this.router.navigate(['/login']);
  }

}

import { Component, OnDestroy } from '@angular/core';
import {AuthService} from './_services/auth.service';
import { Router } from '@angular/router';
import { User } from './_models/user';
import {Role} from './_models/role';
import { MqttService } from "ngx-mqtt";
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'FutureHAUS';
  currentUser: User;
  private subscription: Subscription;

  constructor(private router: Router,
    private authService: AuthService,
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);

  }

  get isUser() {
    return this.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

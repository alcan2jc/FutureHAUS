import { Component, OnInit, Input } from '@angular/core';
import { interval, Subscription, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'money-component',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss']
})
export class MoneyComponent implements OnInit {

  money: number;
  @Input() numRows: number;
  spacer: string;
  subscription: Subscription;
  polltime;
  constructor() { }

  ngOnInit(): void {
    this.money = Math.floor(Math.random() * 10);
    this.polltime = interval(3000);
    this.subscription = this.polltime.subscribe(() => {
      this.money += Math.random() * 1;
    });
    this.money = 5;
    this.spacer = "padding-bottom: " + ((window.screen.height / 5) / 4).toString() + 'px;';
  }
}

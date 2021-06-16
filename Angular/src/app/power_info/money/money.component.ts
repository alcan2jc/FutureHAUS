import { Component, OnInit, Input } from '@angular/core';
import { interval, Subscription, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'money-component',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.scss']
})
export class MoneyComponent implements OnInit {

  money: number;
  lastWeekMoney: number;
  @Input() numRows: number;
  subscription: Subscription;
  polltime;
  color: string;
  constructor() { }

  ngOnInit(): void {
    this.money = Math.floor(Math.random() * 10);
    this.polltime = interval(3300);
    this.subscription = this.polltime.subscribe(() => {
      this.money += Math.random() * 1;
    });
    this.money = 5;
    this.lastWeekMoney = 7;
    this.color = this.money > this.lastWeekMoney ? "color: green;" : "color: red";
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'produced-component',
  templateUrl: './produced.component.html',
  styleUrls: ['./produced.component.scss']
})
export class ProducedComponent implements OnInit {

  constructor() { }

  electricity: number;
  lastWeekElectricity: number;
  @Input() numRows: number;
  style: string;
  subscription: Subscription;
  polltime;

  ngOnInit(): void {
    this.style = "width: " + (window.screen.width / 3) + "px;";
    this.polltime = interval(3500);
    this.electricity = Math.floor(Math.random() * 50);
    this.lastWeekElectricity = 70;
    this.subscription = this.polltime.subscribe(() => {
      this.electricity += Math.random() * 2;
    });
  }
}

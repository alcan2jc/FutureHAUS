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
  spacer: string;
  @Input() numRows: number;
  subscription: Subscription;
  polltime;

  ngOnInit(): void {
    this.polltime = interval(3000);
    this.electricity = Math.floor(Math.random() * 50);
    this.subscription = this.polltime.subscribe(() => {
      this.electricity += Math.random() * 2;
    });
    this.spacer = "padding-bottom: " + ((window.screen.height / this.numRows) / 4).toString() + 'px;';
  }

}

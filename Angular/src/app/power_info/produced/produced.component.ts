import { Component, Input, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { PowerService } from '../../_services/power.service'; //*

//*
interface PowerData {
  prod: [number, number],
  cons: [number, number],
  net: [number, number]
}

@Component({
  selector: 'produced-component',
  templateUrl: './produced.component.html',
  styleUrls: ['./produced.component.scss']
})
export class ProducedComponent implements OnInit {

  //*
  constructor(private powerService: PowerService) {
    this.subscription = this.powerService.powerData.subscribe((data: PowerData) => {
      this.data = data;
    });
  }
  @Input() numRows: number;
  @Input() numCols: number;
  @Input() bgColor: string;
  style: string;
  subscription: Subscription;
  polltime;
  production: number[];
  consumption: number[];
  data: PowerData;
  producing: number;

  ngOnInit(): void {
    // this.style = "width: " + ((window.screen.width / this.numCols) *.9) + "px; background-color: " + this.bgColor;
    this.style = "width: " + (98 / this.numCols).toString() + "vw; background-color: " + this.bgColor;
    this.polltime = interval(3500);
    this.producing = 0;
    this.subscription = this.polltime.subscribe(() => {
      this.producing = Math.ceil(this.data.prod[1] - this.data.cons[1]);
    });
  }
}

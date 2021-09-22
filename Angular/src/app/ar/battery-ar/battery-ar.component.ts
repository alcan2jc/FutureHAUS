import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'batteryAR-component',
  templateUrl: './battery-ar.component.html',
  styleUrls: ['./battery-ar.component.scss']
})
export class BatteryArComponent implements OnInit {
  style: string;
  voltage: number;
  constructor() { }

  ngOnInit(): void {
    this.style = "width: 50vw; height: 50vh; margin: 5px; border: 1px solid #555";
    this.voltage = Math.round(Math.random() * 20);
  }

}

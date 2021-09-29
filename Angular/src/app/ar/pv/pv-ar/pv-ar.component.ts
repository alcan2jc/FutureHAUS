import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pvAR-component',
  templateUrl: './pv-ar.component.html',
  styleUrls: ['./pv-ar.component.scss']
})
export class PvArComponent implements OnInit {
  style: string;
  voltage: number;
  constructor() { }

  ngOnInit(): void {
    this.style = "width: 49vw; height: 45vh; border: 1px solid #555";
    this.voltage = Math.round(Math.random() * 20);
  }
}

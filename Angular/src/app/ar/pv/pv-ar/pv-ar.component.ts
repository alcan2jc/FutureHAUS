import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pvAR-component',
  templateUrl: './pv-ar.component.html',
  styleUrls: ['./pv-ar.component.css']
})
export class PvArComponent implements OnInit {
  style: string;
  voltage: number;
  constructor() { }

  ngOnInit(): void {
    this.style = "width: 50vw; height: 50vh; margin: 10px; border: 1px solid #555";
    this.voltage = Math.round(Math.random() * 20);
  }
}

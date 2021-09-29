import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'inverterAR-component',
  templateUrl: './inverter-ar.component.html',
  styleUrls: ['./inverter-ar.component.scss']
})
export class InverterARComponent implements OnInit {
  style: string;
  produced: number;
  constructor() { }

  ngOnInit(): void {
    this.style = "width: 47vw; height: 49vh; margin: 5px; border: 1px solid #555";
    this.produced = Math.round(Math.random() * 20);
  }
}

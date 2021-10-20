import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'inverterAR-component',
  templateUrl: './inverter-ar.component.html',
  styleUrls: ['./inverter-ar.component.scss']
})
export class InverterARComponent implements OnInit {
  @Input() style: string;
  produced: number;
  constructor() { }

  ngOnInit(): void {
    // this.style = "width: 50vw; height: 85vh; margin: 1px; border: 1px solid #555";
    this.produced = Math.round(Math.random() * 20);
  }
}

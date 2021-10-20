import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chargeAR-component',
  templateUrl: './charge-ar.component.html',
  styleUrls: ['./charge-ar.component.scss']
})
export class ChargeArComponent implements OnInit {
  @Input() style: string;
  voltage: number;
  constructor() { }

  ngOnInit(): void {
    // this.style = "width: 49vw; height: 45vh; margin: 5px; border: 1px solid #555";
    this.voltage = Math.round(Math.random() * 20);
  }

}

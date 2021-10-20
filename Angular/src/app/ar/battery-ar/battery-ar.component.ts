import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'batteryAR-component',
  templateUrl: './battery-ar.component.html',
  styleUrls: ['./battery-ar.component.scss']
})
export class BatteryArComponent implements OnInit {
  @Input() style: string;
  voltage: number;

  constructor() { }

  ngOnInit(): void {
    this.voltage = Math.round(Math.random() * 20);
  }
}

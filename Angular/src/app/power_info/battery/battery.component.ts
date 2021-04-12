import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit {

  public chartLabels: Label[] = ['Battery Voltage'];
  public chartData: MultiDataSet = [
    [52.6],
  ];

  public colors=[
    {
      backgroundColor: [
        'green'
    ]
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}

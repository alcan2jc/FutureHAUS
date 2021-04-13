import { Component, OnInit, ViewChild } from '@angular/core';

import { Label, PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit {

  public chartLabels: Label[] = ['Battery Voltage'];
  public chartData =52.6;

  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw(chart) {
      const ctx = chart.ctx;
      const txt = 'Center Text';

      //Get options from the center object in options
      const sidePadding = 60;
      const sidePaddingCalculated = (sidePadding / 100) * (100* 2)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (100 * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = (100 * 2);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      ctx.font = fontSizeToUse + 'px Arial';
      ctx.fillStyle = 'blue';

      // Draw text in center
      if (typeof(this.chartData == 'undefined')) {
        this.chartData = 52.6;
      }
      ctx.fillText(this.chartData.toString() + 'V', centerX, centerY);
    }
  }];
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

import { Component, OnInit, ViewChild } from '@angular/core';

import { Label, PluginServiceGlobalRegistrationAndOptions, BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from "chart.js";

const Nominal = 52.6;

@Component({
  selector: 'battery-component',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})

export class BatteryComponent implements OnInit {

  @ViewChild(BaseChartDirective) basechart: BaseChartDirective;
  public chartLabels: Label[] = ['Battery Voltage', 'Total'];
  currentVoltage = Nominal;
  public chartData = [this.currentVoltage, Nominal - this.currentVoltage];
  public chartOptions: ChartOptions = {
    animation: {
      onComplete: function() {
        this.modifyCenterText();
      }.bind(this)
    }
  };
  // public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
  //   beforeDraw(chart) {
  //     const ctx = chart.ctx;
  //     const txt = 'Center Text';

  //     //Get options from the center object in options
  //     const sidePadding = 60;
  //     const sidePaddingCalculated = (sidePadding / 100) * (100 * 2)
  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
  //     const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

  //     //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
  //     const stringWidth = ctx.measureText(txt).width;
  //     const elementWidth = (100 * 2) - sidePaddingCalculated;

  //     // Find out how much the font can grow in width.
  //     const widthRatio = elementWidth / stringWidth;
  //     const newFontSize = Math.floor(30 * widthRatio);
  //     const elementHeight = (100 * 2);

  //     // Pick a new font size so it will not be larger than the height of label.
  //     const fontSizeToUse = Math.min(newFontSize, elementHeight);

  //     ctx.font = fontSizeToUse + 'px Arial';
  //     ctx.fillStyle = 'blue';

  //     // Draw text in center
  //     // if (typeof (this.chartData == 'undefined')) {
  //     //   this.chartData = [this.currentVoltage, Nominal - this.currentVoltage];
  //     // }
  //     if (typeof (this.currentVoltage == 'undefined')) {
  //       this.currentVoltage = Nominal;
  //     }
  //     ctx.fillText(this.currentVoltage.toString() + 'V', centerX, centerY);
  //   }
  // }];
  public colors = [
    {
      backgroundColor: [
        'green'
      ]
    }
  ];
  constructor() { }

  ngOnInit(): void {
    // this.update();
  }

  update() {
    // setInterval(() => {
    // }, 5000);
    this.chartLabels.length = 0
    this.chartLabels.push(...['Battery Voltage', 'Nominal Voltage']);
    this.chartData.length = 0;
    let newVoltage = Math.random() * Nominal;
    this.currentVoltage = newVoltage;
    this.chartData.push(...[newVoltage, Nominal - newVoltage]);
    this.basechart.chart.config.data.labels = this.chartLabels;
    this.basechart.chart.update();
  }

  modifyCenterText() {
    const chart = this.basechart.chart;
    const ctx = chart.ctx;
    const txt = this.currentVoltage.toFixed(1).toString();

    //Get options from the center object in options
    const sidePadding = 60;
    const sidePaddingCalculated =
      (sidePadding / 100) * (chart["innerRadius"] * 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

    //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
    const stringWidth = ctx.measureText(txt).width;
    const elementWidth = chart["innerRadius"] * 2 - sidePaddingCalculated;

    // Find out how much the font can grow in width.
    const widthRatio = elementWidth / stringWidth;
    const newFontSize = Math.floor(25 * widthRatio);
    const elementHeight = chart["innerRadius"] * 2;

    // Pick a new font size so it will not be larger than the height of label.
    const fontSizeToUse = Math.min(newFontSize, elementHeight);

    ctx.font = fontSizeToUse + "px Arial";
    ctx.fillStyle = "blue";

    // Draw text in center
    ctx.fillText(txt, centerX, centerY);
  }

}

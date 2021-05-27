import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import theme from 'highcharts/themes/dark-unica';
import { interval, Subscription } from 'rxjs';


HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
theme(Highcharts);

@Component({
  selector: 'battery-component',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss']
})

export class BatteryComponent implements OnInit {

  constructor() { }
  data: Number[];
  polltime;
  updateFlag: boolean;
  subscription: Subscription;
  Highcharts: typeof Highcharts = Highcharts;

  gaugeOptions: Highcharts.Options = {

    chart: {
      type: 'solidgauge'
    },

    title: {
      text: 'Battery Voltage'
    },

    pane: {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: [{
        backgroundColor: '#111',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }]
    },

    exporting: {
      enabled: false
    },

    tooltip: {
      enabled: false
    },

    // the value axis
    yAxis: {
      min: 0,
      max: 52.6,
      title: {
        text: 'Voltage',
        y: -70
      },
      stops: [
        [0.1, '#DF5353'], // red
        [0.9, '#55BF3B'] // green

      ],
      lineWidth: 5,
      tickWidth: 2,
      minorTickInterval: null,
      tickAmount: 5,
      tickInterval: (3),
      labels: {
        y: 15
      }
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    },

    credits: {
      enabled: false
    },

    series: [{
      name: 'Voltage',
      type: undefined,
      data: [0],
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:25px">{y}</span><br/>' +
          '<span style="font-size:12px;opacity:0.4">V</span>' +
          '</div>'
      },
    }]
  }

  ngOnInit(): void {
    this.updateFlag = false;
    this.polltime = interval(3000);
    this.subscription = this.polltime.subscribe(() => {
      this.data = [Math.floor(Math.random() * 50)];
      this.update(this.data);
    });
  }

  update(val) {
    this.gaugeOptions.series = [{
      name: 'Voltage',
      type: undefined,
      data: val,
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:25px">{y}</span><br/>' +
          '<span style="font-size:12px;opacity:0.4">V</span>' +
          '</div>'
      },
    }]
    this.updateFlag=true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

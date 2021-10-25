import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from "highcharts";
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import theme from 'highcharts/themes/dark-unica';
import { interval, Subscription } from 'rxjs';
import { SchneiderService } from '../../_services/schneider.service';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
theme(Highcharts);

interface SchneiderData {
  dc_voltage: number[],
  pv_power: number,
  pv_current: string,
  pv_voltage: string
}

@Component({
  selector: 'battery-component',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss']
})

export class BatteryComponent implements OnInit {

  @Input() numRows: number;
  @Input() numCols: number;
  @Input() bgColor: string;
  style: string;
  voltage: Number[];
  polltime;
  updateFlag: boolean;
  subscription: Subscription;
  data: SchneiderData;
  Highcharts: typeof Highcharts = Highcharts;

  constructor(private schneiderService: SchneiderService) {
    this.subscription = this.schneiderService.schneiderData.subscribe((data: SchneiderData) => {
      this.data = data;
    });
  }

  gaugeOptions: Highcharts.Options = {

    chart: {
      type: 'solidgauge',
      // backgroundColor: "#2a2a2b"
      backgroundColor: "#272e48",
      style: {
        margin: 1
      }
    },
    //*
    title: {
      text: 'Battery Voltage',
      floating: true,
      style: { fontSize: "18px", fontWeight: 'bold'},
      // align: "left",
      y: 10,
    },

    pane: {
      center: ['50%', '60%'],
      size: '90%',
      startAngle: -90,
      endAngle: 90,
      background: [{
        backgroundColor: '#111',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }],
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
        y: 0
      }
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: -2,
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
      data: [{ y: 0, dataLabels: { x: 0, y: -20 } }],
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:23px">{y} V</span><br/>' +
          '</div>'
      },
    }]
  }

  ngOnInit(): void {
    //Subscribe to MQTT topic
    //*90
    this.style = "width: " + (90 / this.numCols).toString() + "vw; background-color: " + this.bgColor;
    this.gaugeOptions.chart = {
      type: 'solidgauge',
      marginRight: 1,
      width: (window.screen.width / this.numCols) * .80, //*
      height: (window.screen.height / this.numRows) * .85, //*
      // backgroundColor: "#2a2a2b",
      backgroundColor: this.bgColor,
      // backgroundColor: "#272e48",
    };
    this.polltime = interval(2000);

    this.subscription = this.polltime.subscribe(() => {
      this.schneiderService.getScraped();
      this.update(this.data.dc_voltage);
    });
  }

  update(voltage) {
    this.updateFlag = false;
    this.gaugeOptions.series = [{
      name: 'Voltage',
      type: undefined,
      data: voltage,
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:20px; y:-20">{y} V</span><br/>' +
          '</div>',
        
      },
    }]
    this.updateFlag = true;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from "highcharts";
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import theme from 'highcharts/themes/dark-unica';
import { Subscription } from 'rxjs';
import { MqttService } from 'ngx-mqtt';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
theme(Highcharts);

@Component({
  selector: 'battery-component',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.scss']
})

export class BatteryComponent implements OnInit {

  constructor(private mqtt: MqttService) { }
  @Input() numRows: number;
  @Input() numCols: number;
  @Input() bgColor: string;
  style: string;
  voltage: Number[];
  polltime;
  updateFlag: boolean;
  subscription: Subscription;
  Highcharts: typeof Highcharts = Highcharts;

  gaugeOptions: Highcharts.Options = {

    chart: {
      type: 'solidgauge',
      // backgroundColor: "#2a2a2b"
      backgroundColor: "#272e48",
    },

    title: {
      text: 'Battery Charge',
      style: { fontSize: "30px" }
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
          y: 3,
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
          '<span style="font-size:23px">{y} V</span><br/>' +
          '</div>'
      },
    }]
  }

  ngOnInit(): void {
    //Subscribe to MQTT topic

    this.style = "width: " + (window.screen.width / (this.numCols) * .9) + "px; background-color: " + this.bgColor;
    this.gaugeOptions.chart = {
      type: 'solidgauge',
      marginRight: 1,
      width: (window.screen.width / this.numCols) * .85,
      height: (window.screen.height / this.numRows) * .9,
      // backgroundColor: "#2a2a2b",
      backgroundColor: this.bgColor,
      // backgroundColor: "#272e48",
    };

    this.updateFlag = false;

    const topic = 'FutureHAUS/Website/Battery';
    this.subscription = this.mqtt.observe(topic).subscribe((msg) => {
      let voltage: number[] = [+msg.payload.toString()];
      voltage[0] = +voltage[0].toPrecision(3);
      this.update(voltage)
    });
  }

  update(voltage) {
    this.gaugeOptions.series = [{
      name: 'Voltage',
      type: undefined,
      data: voltage,
      dataLabels: {
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:20px">{y} V</span><br/>' +
          '</div>'
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

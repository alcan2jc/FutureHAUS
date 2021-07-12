import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
import { Subscription } from 'rxjs';
import { PowerService } from '../../_services/power.service';
theme(Highcharts);

interface PowerData {
  prod: [number, number],
  cons: [number, number],
  net: [number, number]
}

@Component({
  selector: 'net-component',
  templateUrl: './net.component.html',
  styleUrls: ['./net.component.scss']
})
export class NetComponent implements OnInit {
  @Input() numRows;
  @Input() bgColor;
  style: string;
  updateFlag: boolean;
  net: number[];
  data: PowerData;
  subscription: Subscription;
  polltime;
  interval;
  constructor(private power_service: PowerService) {
    this.subscription = this.power_service.powerData.subscribe((data: PowerData) => {
      this.data = data;
    });
  }
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'area',
      width: window.screen.width * .96,
    },
    title: {
      text: "Loading..."
    }
  }
  ngOnInit(): void {
    this.style = "width: " + window.screen.width * .965 + "px; background-color: " + this.bgColor;
    this.net = [];
    this.updateFlag = false;
    var power = this;
    this.chartOptions = {
      chart: {
        type: 'area',
        width: window.screen.width * .96,
        height: (window.screen.height * 2) / (this.numRows) * .88,
        backgroundColor: this.bgColor,
        events: {
          load: function () {
            // set up the updating of the chart each second
            var net = this.series[0];
            power.interval = setInterval(function () {
              net.addPoint(power.data.net, true, true);
            }, 2000);
          }
        }
      },

      time: {
        useUTC: false
      },

      title: {
        text: 'Net Power',
        style: {
          fontSize: "300%"
        }
      },

      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        labels: {
          style: {
            fontSize: "150%"
          },
        },
      },
      yAxis: {
        title: {
          text: 'Total Power (KwH)',
          style: {
            fontSize: "200%",
            color: "white"
          }
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }],

        labels: {
          style: {
            fontSize: "150%"
          },
          formatter: function () {
            return (Number(this.value)).toString() + " KWh";
          }
        }
      },
      plotOptions: {
        area: {
          fillOpacity: 0.5
        }
      },
      legend: {
        itemStyle: {
          fontSize: "200%"
        }
      },

      series: [{
        name: "Net",
        type: 'area',
        data: Array.from({ length: 5 }, () => {
          return [(new Date).getTime(), 0]
        }),
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
          stops: [
            [0, '#0000FF'],
            [1, '#FFF']
          ],
        },
        marker: {
          enabled: false
        }
      },
      ]
    }
    this.updateFlag = true;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscription.unsubscribe;
  }
}

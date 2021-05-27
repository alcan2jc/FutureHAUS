import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
// import { WeatherService } from "../../_services/weather.service";
import { parse } from 'node-html-parser';
theme(Highcharts);

interface Data {
  time: string[]
  temp: number[]
}

@Component({
  selector: 'weather-component',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  dates: string[];
  temps: number[];
  updateFlag;
  constructor() { }
  Highcharts: typeof Highcharts = Highcharts;
  url = "https://www.yr.no/place/United_States/Virginia/Blacksburg/forecast_hour_by_hour.xml";
  chartOptions: Highcharts.Options = {
    chart: {
      plotBorderWidth: 1,
      width: 1150,
      height: 250,
      alignTicks: false,
      scrollablePlotArea: {
        minWidth: 720
      }
    },

    title: {
      text: 'Weather',
      align: 'left',
      style: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    },

    xAxis: {
      // type: 'datetime',
      // tickInterval: 2 * 3600 * 1000, // two hours
      // minorTickInterval: 3600 * 1000, // one hour
      // tickLength: 0,
      // gridLineWidth: 1,
      // gridLineColor: 'rgba(128, 128, 128, 0.1)',
      // startOnTick: false,
      // endOnTick: false,
      // minPadding: 0,
      // maxPadding: 0,
      // offset: "30",
      // showLastLabel: true,
      // labels: {
      //   format: '{value:%H}'
      // },
      // crosshair: true

      categories: [""]
    },

    yAxis: {
      title: {
        text: 'Temperature (F)'
      },
      labels: {
        formatter: function () {
          return (Number(this.value)).toString() + "°";
        }
      }
    },

    legend: {
      enabled: false
    },

    plotOptions: {
      series: {
        pointPlacement: 'between'
      }
    },

    series: [{
      name: "Temperature",
      type: undefined,
      data: [0],
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: true
          }
        }
      },
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
          '{series.name}: <b>{point.value}°F</b><br/>'
      },
      zIndex: 1,
      color: '#FF3333',
      negativeColor: '#48AFE8'
    }]
  }

  ngOnInit(): void {
    this.updateFlag = false;
    this.update();
  }

  update() {
    this.getData().then((data) => {
      this.dates = data.time;
      this.temps = data.temp;
      this.chartOptions.xAxis = {
        categories: this.dates
      }

      this.chartOptions.series = [{
        name: "Temperature",
        type: 'spline',
        data: this.temps,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.value}°F</b><br/>'
        },
        zIndex: 1,
        color: '#FF3333',
        negativeColor: '#48AFE8'
      }]
      this.updateFlag = true;
    })
  }

  getData(): Promise<Data> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("https://weather.com/weather/hourbyhour/l/f32f2d2e3156f59f830e0ec31299d884965f61dafac4c7b472390cfc20f076a0");
        const text = await response.text();
        const document = parse(text);
        let hours = [];
        let tmps = [];
        let items = document.querySelectorAll('.DetailsSummary--tempValue--RcZzi');

        items.forEach((item) => {
          tmps.push(
            Number(item.innerHTML.substr(0, item.innerHTML.indexOf('°')))
          );
        });

        items = document.querySelectorAll('.DetailsSummary--daypartName--1Mebr');
        items.forEach((item) => {
          hours.push(
            item.innerHTML
          );
        });

        let res: Data = {
          time: hours,
          temp: tmps,
        }

        return resolve(res);
      } catch (e) {
        return reject(e);
      }
    })
  }
}

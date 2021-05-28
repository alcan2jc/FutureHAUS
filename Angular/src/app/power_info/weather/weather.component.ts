import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
// import { WeatherService } from "../../_services/weather.service";
import { parse } from 'node-html-parser';
theme(Highcharts);

interface Data {
  time: string[]
  temp: number[]
  days: string[]
  symbols
}

@Component({
  selector: 'weather-component',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  dates: string[];
  temps: number[];
  days: string[];
  symbols;
  updateFlag;
  constructor() { }
  Highcharts: typeof Highcharts = Highcharts;
  url = "https://www.yr.no/place/United_States/Virginia/Blacksburg/forecast_hour_by_hour.xml";
  chartOptions: Highcharts.Options = {
    chart: {
      plotBorderWidth: 1,
      width: 890,
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

    xAxis: [{
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
    }, {
      categories: [""],
      opposite: true,
      labels: {
        format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
        align: 'left',
        x: 3,
        y: -5
      },
    }],

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
          '{series.name}: <b>{point.y}°F</b><br/>'
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
      this.days = data.days;
      this.chartOptions.xAxis = [{
        categories: this.dates
      }, {
        linkedTo: 0,
        categories: this.days,
        opposite: true,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
          align: 'center',
          x: 3,
          y: -5,
          rotation: 0,
          overflow: "allow"
        },
        tickLength: 20,
        gridLineWidth: 1
      }]

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
            '{series.name}: <b>{point.y}°F</b><br/>'
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
        let days = [];
        let symbols = [];
        let index = 1;
        let items = document.querySelectorAll('.HourlyForecast--DisclosureList--OznTI');
        items.forEach((item) => {
          let day = item.querySelectorAll('.HourlyForecast--longDate--3khKr');
          days.push(day[0].innerHTML);
          let temps = item.querySelectorAll('.DetailsSummary--tempValue--RcZzi');
          temps.forEach((temp) => {
            tmps.push(
              Number(temp.innerHTML.substr(0, temp.innerHTML.indexOf('°')))
            );
          });

          let times = item.querySelectorAll('.DetailsSummary--daypartName--1Mebr');

          times.forEach((time) => {
            hours.push(
              time.innerHTML
            );
            console.log(time.innerHTML === "12 am");
            if (time.innerHTML === "12 am") {
              days.push(day[index].innerHTML);
              index++;
            } else {
              days.push("");
            }
          });
          days.shift();
          console.log(days.length);
          console.log(hours.length);
        })





        let res: Data = {
          time: hours,
          temp: tmps,
          days: days,
          symbols: null
        }

        return resolve(res);
      } catch (e) {
        return reject(e);
      }
    })
  }

  // getData(): Promise<Data> {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       var req = new XMLHttpRequest();
  //       req.open('GET', this.url, true);

  //       console.log(req);
  //       // const response = await fetch(this.url);
  //       // const text = await response.text();
  //       // const document = new DOMParser().parseFromString(req.responseXML, 'application/xml');
  //       req.send();
  //       let hours = [];
  //       let tmps = [];
  //       let symbols = [];

  //       console.log(req);
  //       console.log(req.responseXML.toString());

  //       // let forecast = req.querySelector('.folder6.folder');
  //       // console.log(forecast);
  //     } catch (e) {
  //       return reject(e);
  //     }
  //   })
  // }
}

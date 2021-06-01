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
  symbols: string[]
}

@Component({
  selector: 'weather-component',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  times: string[];
  temps: number[];
  days: string[];
  symbols: string[];
  updateFlag;
  constructor() { }
  Highcharts: typeof Highcharts = Highcharts;
  url = "https://www.yr.no/place/United_States/Virginia/Blacksburg/forecast_hour_by_hour.xml";
  chartOptions: Highcharts.Options = {
    time: {
      useUTC: false
    },
    chart: {
      plotBorderWidth: 1,
      width: 890,
      height: 250,
      alignTicks: false,
      scrollablePlotArea: {
        minWidth: 720
      },
      events: {
        load() {
          this.renderer.image('');
        }
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
      this.times = data.time;
      this.temps = data.temp;
      this.days = data.days;
      this.symbols = data.symbols;

      this.chartOptions.xAxis = [{
        categories: this.times,
        labels: {
          align: 'right',
          rotation: -45
        },
        tickmarkPlacement: 'on'

      }, {
        linkedTo: 0,
        categories: this.days,
        opposite: true,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
          align: 'center',
          x: 0,
          y: -10,
          rotation: 0,
          overflow: "allow"
        },
        tickLength: 0,
        gridLineWidth: 2
      }]

      this.chartOptions.series = [{
        name: "Temperature",
        type: "spline",
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
        negativeColor: '#48AFE8',
      }]

      var chart = this;
      if (this.chartOptions.series[0].type === 'spline') {
        this.chartOptions.series[0].data.forEach((p: Highcharts.PointOptionsObject, i) => {
          console.log(p);
          this.chartOptions.chart.events = {
            load() {
              this.renderer.image('../../../assets/WeatherSymbols/Rain.svg',
                1000, 500, 30, 30)
                .attr({ zIndex: 5 })
                .add();
            }
          }
        })
      }

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

        let day = document.querySelectorAll('.HourlyForecast--longDate--3khKr');
        let temps = document.querySelectorAll('.DetailsSummary--tempValue--RcZzi');
        temps.forEach((temp) => {
          tmps.push(
            Number(temp.innerHTML.substr(0, temp.innerHTML.indexOf('°')))
          );
        });

        let times = document.querySelectorAll('.DetailsSummary--daypartName--1Mebr');

        times.forEach((time) => {
          hours.push(
            time.innerHTML
          );

          let condition = Number(times[0].innerHTML.substr(0, times[0].innerHTML.indexOf(' ')));
          if (condition % 2 === 0 && time.innerHTML === "12 am") {
            console.log(day);
            days.push(day[index].innerHTML);
            index++;
          } else if (condition % 2 === 1 && time.innerHTML === "1 am") {
            days.push(day[index].innerHTML);
            index++;
          } else {
            days.push("");
          }
        });

        let images = document.querySelectorAll('.DetailsSummary--condition--mqdxh svg');
        images.forEach((image) => {
          symbols.push(image.innerText);
        })

        let res: Data = {
          time: hours,
          temp: tmps,
          days: days,
          symbols: symbols
        }

        return resolve(res);
      } catch (e) {
        return reject(e);
      }
    })
  }
}

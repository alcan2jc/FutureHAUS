import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
// import { WeatherService } from "../../_services/weather.service";
import { parse } from 'node-html-parser';
import { interval, Subscription } from 'rxjs';
// import * as puppeteer from 'puppeteer';
theme(Highcharts);

interface Data {
  time: string[]
  temp: number[]
  days: string[]
  symbols: string[]
  location: string
}

interface PlottablePoint extends Highcharts.Point {
  plotX: number;
  plotY: number;
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
  location: string;
  updateFlag;
  @Input() numRows;
  subscription: Subscription;
  polltime;

  constructor() { }
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    title: {
      text: "Loading..."
    },
    time: {
      useUTC: false
    },
    chart: {
      plotBorderWidth: 1,
      width: (window.screen.width),
      backgroundColor: "#272e48",
      alignTicks: true,
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
    this.polltime = interval(15 * 60 * 1000);
    // this.polltime = interval(3000);
    this.update();
    this.subscription = this.polltime.subscribe(() => {
      this.update();
    });

    let weather = this;
    //Weather symbols from https://cdn.jsdelivr.net/gh/YR/weather-symbols@6.0.2/dist/svg/
    this.chartOptions.chart = {
      plotBorderWidth: 1,
      width: (window.screen.width),
      height: (window.screen.height) * (2 / this.numRows) * .9,
      backgroundColor: "#272e48",
      alignTicks: true,
      events: {
        render() {
          this.series[0].data.forEach((p: PlottablePoint, i) => {
            if (weather.symbols[i] !== "" && p.category !== "") {
              var image = this.renderer.image('../../../assets/WeatherSymbols/' + weather.symbols[i] + '.svg',
                p.plotX + this.plotLeft - 20, p.plotY + this.plotTop - 30, 30, 30)
                .attr({
                  zIndex: 5
                })
                .add();

              setTimeout(function () {
                image.destroy();
              }, 15 * 60 * 60 * 60);
            }
          })
        }
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  update() {
    this.updateFlag = false;
    this.getData().then((data) => {
      this.times = data.time;
      this.temps = data.temp;
      this.days = data.days;
      this.symbols = data.symbols;
      this.location = data.location;

      this.chartOptions.title = {
        text: 'Weather for ' + this.location,
        align: 'center',
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      };

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
      }];

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
        color: '#FF3333',
        negativeColor: '#48AFE8'
      }];
      this.updateFlag = true;
    })
  }


  getData(): Promise<Data> {
    return new Promise(async (resolve, reject) => {
      try {

        let responseLoc = await fetch("https://weather.com/weather/hourbyhour/l/f32f2d2e3156f59f830e0ec31299d884965f61dafac4c7b472390cfc20f076a0");
        let text = await responseLoc.text();
        let document = parse(text);

        let hours = [];
        let tmps = [];
        let days = [];
        let symbols = [];
        let loc = "";
        let index = 1;

        loc = document.querySelector(`[class*="LocationPageTitle--PresentationName"]`).innerHTML;
        let day = document.querySelectorAll('[class*="HourlyForecast--longDate"]');
        document.querySelectorAll('[class*="DetailsSummary--tempValue"]').forEach((temp) => {
          tmps.push(
            Number(temp.innerHTML.substr(0, temp.innerHTML.indexOf('°')))
          );
        });

        let times = document.querySelectorAll('[class*="DetailsSummary--daypartName"]');
        times.forEach((time) => {
          hours.push(
            time.innerHTML
          );

          let condition = Number(times[0].innerHTML.substr(0, times[0].innerHTML.indexOf(' ')));
          if (condition % 2 === 0 && time.innerHTML === "12 am") {
            days.push(day[index].innerHTML);
            index++;
          } else if (condition % 2 === 1 && time.innerHTML === "1 am") {
            days.push(day[index].innerHTML);
            index++;
          } else {
            days.push("");
          }
        });

        let images = document.querySelectorAll('[class*="DetailsSummary--condition"] svg');
        images.forEach((image, i) => {
          if (i % 2 == 0) {
            symbols.push(image.innerText);
          } else {
            symbols.push("");
          }
        })

        let res: Data = {
          time: hours,
          temp: tmps,
          days: days,
          symbols: symbols,
          location: loc
        }

        return resolve(res);
      } catch (e) {
        return reject(e);
      }
    })
  }
}


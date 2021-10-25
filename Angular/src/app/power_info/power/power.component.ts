import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
import { PowerService } from '../../_services/power.service';
import { Subscription } from 'rxjs';
theme(Highcharts);

interface PowerData {
    prod: [number, number],
    cons: [number, number],
    net: [number, number]
}

@Component({
    selector: 'power-component',
    templateUrl: './power.component.html',
    styleUrls: ['./power.component.scss']
})
export class PowerComponent implements OnInit {
    @Input() numRows;
    @Input() bgColor;
    style: string;
    updateFlag: boolean;
    consumption: number[];
    subscription: Subscription;
    production: number[];

    data: PowerData;

    polltime;
    interval;
    constructor(private powerService: PowerService) {
        this.subscription = this.powerService.powerData.subscribe((data: PowerData) => {
            this.data = data;
        });
    }
    Highcharts: typeof Highcharts = Highcharts;

    chartOptions: Highcharts.Options = {
        chart: {
            type: 'area',
            width: window.screen.width,
        },
        title: {
            text: "Loading..."
        }
    }

    ngOnInit(): void {
        // this.style = "width: " + window.screen.width * .965 + "px; background-color: " + this.bgColor;
        this.style = "width: 98vw; background-color: " + this.bgColor;
        this.updateFlag = false;
        this.production = [];
        this.consumption = [];
        var power = this;

        this.chartOptions = {
            chart: {
                type: 'area',
                // width: window.screen.width * .96,
                width: window.screen.width * .95,
                height: (window.screen.height * 2) / (this.numRows) * .75,
                backgroundColor: this.bgColor,
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        var chart = this;
                        var production = this.series[0];
                        var consumption = this.series[1];
                        power.interval = setInterval(function () {
                            power.powerService.getPower();
                            production.addPoint(power.data.prod, false, true);
                            consumption.addPoint(power.data.cons, false, true);
                            chart.redraw();
                        }, 2000);
                    }
                }
            },
            credits: {
                enabled: false
            },
            time: {
                useUTC: false
            },

            title: {
                text: 'Power Production/Consumption',
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
                    text: 'Current Power (kW)',
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
                        return (Number(this.value)).toString() + " kW";
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
                name: "Production",
                type: 'area',
                data: Array.from({ length: 5 }, () => {
                    return [(new Date).getTime(), 0]
                }),
                color: { // green/yellow
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#00FF00'],
                        [1, '#FFFF00']
                    ],
                },
                marker: {
                    enabled: false
                }
            }, {
                name: "Consumption",
                type: 'area',
                data: Array.from({ length: 5 }, () => {
                    return [(new Date).getTime(), 0]
                }),
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#FF0000'],
                        [1, '#FFA500']
                    ],
                },
                opacity: 0.75,
                marker: {
                    enabled: false
                }
            }]
        };
        this.updateFlag = true;
    }

    ngOnDestroy() {
        clearInterval(this.interval);
        this.subscription.unsubscribe();
    }
}

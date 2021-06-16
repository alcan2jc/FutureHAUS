import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
theme(Highcharts);

@Component({
    selector: 'power-component',
    templateUrl: './power.component.html',
    styleUrls: ['./power.component.scss']
})
export class PowerComponent implements OnInit {
    @Input() numRows;
    updateFlag: boolean
    consumption: number[];
    production: number[];
    net: number[];
    polltime;
    constructor() { }
    Highcharts: typeof Highcharts = Highcharts;
    chartRef: Highcharts.Chart;

    chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
        this.chartRef = chart;
    };
    chartOptions: Highcharts.Options = {
        chart: {
            type: 'area',
            width: window.screen.width,
            backgroundColor: "#272e48",
        },
        title: {
            text: "Loading..."
        }
    }

    ngOnInit(): void {
        this.updateFlag = false;
        this.production = [];
        this.consumption = [];
        this.net = [];

        this.chartOptions = {
            chart: {
                type: 'area',
                width: window.screen.width,
                height: (window.screen.height) * (2 / this.numRows),
                backgroundColor: "#272e48",
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        var chart = this;
                        var production = this.series[0];
                        var consumption = this.series[1];
                        var net = this.series[2];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                prody = Math.random() * 20,
                                consy = -Math.random() * 20;
                            production.addPoint([x, prody], false, true);
                            consumption.addPoint([x, consy], false, true);
                            net.addPoint([x, prody + consy], false, true);
                            chart.redraw();
                        }, 2000);
                    }
                }
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

            accessibility: {
                announceNewData: {
                    enabled: true,
                    minAnnounceInterval: 15000,
                    announcementFormatter: function (allSeries, newSeries, newPoint) {
                        if (newPoint) {
                            return 'New point added. Value: ' + newPoint.y;
                        }
                        return false;
                    }
                }
            },

            xAxis: {
                // categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                type: 'datetime',
                tickPixelInterval: 150,
                labels: {
                    style: {
                        fontSize: "150%"
                    },
                }
            },
            yAxis: {
                title: {
                    text: 'Current Power (KwH)',
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
                name: "Production",
                type: 'area',
                data: Array.from({length: 5}, () => {
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
                data: Array.from({length: 5}, () => {
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
            }, {
                name: "Net",    
                type: "line",
                color: "#000080",
                data: Array.from({length: 5}, () => {
                    return [(new Date).getTime(), 0]
                }),
            }]
        };
        this.updateFlag = true;
    }

    // ngOnDestroy() {
    //     this.subscription.unsubscribe();
    // }
}

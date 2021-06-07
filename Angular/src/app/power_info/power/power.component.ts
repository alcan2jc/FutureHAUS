import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts";
import theme from 'highcharts/themes/dark-unica';
theme(Highcharts);

@Component({
    selector: 'power-component',
    templateUrl: './power.component.html',
    styleUrls: ['./power.component.scss']
})
export class PowerComponent implements OnInit {

    constructor() { }
    stretch;
    Highcharts: typeof Highcharts = Highcharts;

    chartOptions: Highcharts.Options = {
        chart: {
            type: 'area',
            width: window.screen.width,
            height: (window.screen.height) * (2/5) * .9
        },
        title: {
            text: 'Power Production/Consumption'
        },
        xAxis: {
            categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            max: 11,
        },
        yAxis: {
            title: {
                text: 'Monthly Average (KwH)'
            },
            labels: {
                formatter: function () {
                    return (Number(this.value)).toString();
                }
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Production',
            type: undefined,
            data: [
                20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
                26662, 26956
            ],
        }, {
            name: 'Consumption',
            type: undefined,
            data: [
                11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
                30062, 32049
            ]
        }]
    }

    ngOnInit(): void {
    }
}

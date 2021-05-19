import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import theme from 'highcharts/themes/dark-unica'; 
// theme(this);

@Component({
  selector: 'dash-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          power: { cols: 1, rows: 1 },
          battery: { cols: 1, rows: 1 },
          weather: {cols: 1, rows: 1 }

        };
      }
 
     return {
        columns: 3,
        power: { cols: 3, rows: 1 },
        battery: { cols: 1, rows: 2 },
        weather: {cols: 2, rows: 2 }
      };
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) { }
}

import {Component} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'dash-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
      
      //cols = what column, rows = how many rows it spans. 
     return {
        columns: 3,
        power: { cols: 3, rows: 2 },
        battery: { cols: 1, rows: 1 },
        weather: {cols: 2, rows: 1 }
      };
    })
  );

  constructor(private breakpointObserver: BreakpointObserver
    ) { }
}

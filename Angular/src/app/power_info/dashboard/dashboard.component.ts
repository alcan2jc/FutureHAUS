import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'dash-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  rowHeightStr: string;
  rowHeight: number;
  numRows: number;
  numCols: number;
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          battery: { cols: 1, rows: 1 },
          money: { cols: 1, rows: 1 },
          temp: { cols: 1, rows: 1 },
          power: { cols: 3, rows: 2 },
          weather: { cols: 2, rows: 1 }
        };
      }

      //how many rows/cols it spans. 
      return {
        columns: this.numCols,
        battery: { cols: 1, rows: 1 },
        money: { cols: 1, rows: 1 },
        temp: { cols: 1, rows: 1 },
        power: { cols: 3, rows: 2 },
        weather: { cols: 3, rows: 2 }
      };
    })
  );

  constructor(private breakpointObserver: BreakpointObserver
  ) {
    this.numRows = 5;
    this.numCols = 3;
    this.rowHeight = (window.screen.height / this.numRows) * .965;
    this.rowHeightStr = ((window.screen.height / this.numRows) * .965).toString() + 'px';
  }
}

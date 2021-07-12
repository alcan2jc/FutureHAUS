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
  numRows: number;
  numCols: number;
  bgColor: string;
  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: this.numCols,
          battery: { cols: 1, rows: 1 },
          title: { cols: 2, rows: 1 },
          produced: { cols: 1, rows: 1 },
          net: { cols: 4, rows: 2 },
          power: { cols: 4, rows: 2 },
          weather: { cols: 4, rows: 2 }
        };
      }

      //how many rows/cols it spans. 
      return {
        columns: this.numCols,
        battery: { cols: 1, rows: 1 },
        title: { cols: 2, rows: 1 },
        produced: { cols: 1, rows: 1 },
        net: { cols: 4, rows: 2 },
        power: { cols: 4, rows: 2 },
        weather: { cols: 4, rows: 2 }
      };
    })
  );

  constructor(private breakpointObserver: BreakpointObserver
  ) {
    this.numRows = 7;
    this.numCols = 4;
    this.bgColor = "#0d1111"
    this.rowHeightStr = (window.screen.height / this.numRows) * .965 + 'px';
  }
}

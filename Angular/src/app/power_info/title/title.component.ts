import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'title-component',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() numRows: number;
  @Input() numCols: number;
  @Input() bgColor: string;
  style: string;
  constructor() { }

  ngOnInit(): void {
    // this.style = "width: " + (2 * window.screen.width / (this.numCols)) + 
    // "px; background-color: " + this.bgColor + ";";
    this.style = "width: " + 2 * (95 / (this.numCols)) + 
    "vw; background-color: " + this.bgColor + ";";
  }
}

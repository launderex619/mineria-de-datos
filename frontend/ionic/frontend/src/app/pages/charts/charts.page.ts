import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import * as _ from 'lodash';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss']
})

export class ChartsPage implements OnInit {

  @ViewChild('chart', { static: true}) el: ElementRef;

  constructor() {}

  ngOnInit() {
    this.basicChart();
  }

  basicChart() {
    const element = this.el.nativeElement;
    const data = [{
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 3, 4, 8, 16]
    }];
    const style = {
      margin: { t: 0}
    };
            // @ts-ignore
    Plotly.plot( element, data, style);
  }
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  // tslint:disable-next-line: no-inferrable-types
  @Input() nameDataset: string = '';
  constructor() { }

  ngOnInit() {
  }

}

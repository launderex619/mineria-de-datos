import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  @Input() nameDataset: string = '';
  constructor() { }

  ngOnInit() {
  }

}

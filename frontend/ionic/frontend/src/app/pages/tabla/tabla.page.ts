import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PropertiesService } from 'src/app/services/properties.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.page.html',
  styleUrls: ['./tabla.page.scss'],
})
export class TablaPage implements OnInit {

  dataset = null;
  datasetCopy = null;
  columns = [];
  properties = null;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private propertiesSerive: PropertiesService,
    private dataService: DataService
    ) { }

  ngOnInit() {
    const version = this.route.snapshot.paramMap.get('version');
    this.getProperties(version);
    this.getData(version);
  }

  async getProperties(version) {
    try {
      const resp = await this.propertiesSerive.getProperties(version).toPromise();
      if(resp.status === 'ok') {
        this.properties = resp.archivo;
        this.properties.atributos_archivo_creado.forEach(element => {
          this.columns.push({ name: element.nombre_atributo, prop: element.nombre_atributo });
        });
        console.log(this.properties);
        console.log(this.columns);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getData(version) {
    try {
      const resp = await this.dataService.getData(version).toPromise();
      if(resp.status === 'ok') {
        this.dataset = resp.datos;
        this.datasetCopy = [];
        if (this.dataset.length > 500) {
          for (let i = 0; i < 500; i++) {
            this.datasetCopy.push(this.dataset[i]);
          }
        } else {
          this.datasetCopy = this.dataset;
        }
        console.log(this.dataset);
        this.loaded = true;
      }
    } catch (error) {
      console.error(error);
    }
  }

}

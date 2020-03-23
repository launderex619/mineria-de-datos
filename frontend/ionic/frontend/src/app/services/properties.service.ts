import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  private readonly API_URL = `${environment.API}/configuracion`;

  constructor(private http: HttpClient) {}

  getProperties(version) {
    return this.http.get(`${this.API_URL}/${version}`).pipe(
      map(resp => {
        return resp;
      })
    );
  }

  createProperties(properties) {
    properties.version = null;
    return this.http
      .post(`${this.API_URL}`, {
        descripcion: properties.descripcion,
        version: properties.version,
        mongo: properties.mongo,
        nombre_base_de_datos: properties.nombre_base_de_datos,
        tablas_base_de_datos: properties.tablas_base_de_datos,
        atributos_base_de_datos: properties.atributos_base_de_datos,
        atributos_archivo_creado: properties.atributos_archivo_creado,
        nombre_archivo_creado: properties.nombre_archivo_creado,
        valor_nulo: properties.valor_nulo
      })
      .pipe(
        map(resp => {
          return resp;
        })
      );
  }

  modifyProperties(properties) {
    properties.version = null;
    return this.http
      .patch(`${this.API_URL}`, {
        descripcion: properties.descripcion,
        version: properties.version,
        mongo: properties.mongo,
        nombre_base_de_datos: properties.nombre_base_de_datos,
        tablas_base_de_datos: properties.tablas_base_de_datos,
        atributos_base_de_datos: properties.atributos_base_de_datos,
        atributos_archivo_creado: properties.atributos_archivo_creado,
        nombre_archivo_creado: properties.nombre_archivo_creado,
        valor_nulo: properties.valor_nulo
      })
      .pipe(
        map(resp => {
          return resp;
        })
      );
  }
}

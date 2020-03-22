import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionesService {
  private readonly API_URL = `${environment.API}/versiones`;

  constructor(private http: HttpClient) { }

  getVersions() {
    return this.http.get(`${this.API_URL}`).pipe(
      map( resp => {
        return resp;
      })
    );
  }

  getLastVersion() {
    return this.http.get(`${this.API_URL}/ultima`).pipe(
      map( resp => {
        return resp;
      })
    );
  }

  getActualVersion() {
    console.log(`${this.API_URL}/actual`);
    return this.http.get(`${this.API_URL}/actual`).pipe(
      map( resp => {
        return resp;
      })
    );
  }
}

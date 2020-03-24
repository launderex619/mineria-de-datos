import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly API_URL = `${environment.API}/datos`;

  constructor(private http: HttpClient) {}

  getData(version) {
    return this.http.get(`${this.API_URL}/${version}`).pipe(
      map(resp => {
        return resp;
      })
    );
  }

  deleteItem(id, version) {
    return this.http.delete(`${this.API_URL}/${version}/${id}`).pipe(
      map(resp => {
        return resp;
      })
    );
  }

  addItem(version, object) {
    return this.http.post(`${this.API_URL}/${version}`, {
      objeto: object
    }).pipe(
      map(resp => {
        return resp;
      })
    );
  }

  editItem(version, index, object) {
    return this.http.patch(`${this.API_URL}/${version}`, {
      id: index,
      objeto: object
    }).pipe(
      map(resp => {
        return resp;
      })
    );
  }
}

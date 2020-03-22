import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  private readonly API_URL = `${environment.API}/configuracion`;

  constructor(private http: HttpClient) { }

  getProperties( version ) {
    return this.http.get(`${this.API_URL}/${version}`).pipe(
      map( resp => {
        return resp;
      })
    );
  }
}

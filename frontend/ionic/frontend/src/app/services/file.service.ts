import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly API_URL = `${environment.API}/archivo`;

  constructor(private http: HttpClient) { }

  getFile( version ) {
    window.open(`${this.API_URL}/${version}`);
  }

  submitFile( version, file ) {
    return this.http.post(`${this.API_URL}/${version}`, file).pipe(
      map( resp => {
        return resp;
      })
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ambiente } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient) { }

  public login(user:string, password:string) {
    return this.http.get<any>(ambiente.urlServicioRest + 'login')
  }
}

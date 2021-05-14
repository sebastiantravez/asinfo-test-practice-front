import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ambiente } from '../environments/environment'
import { UsersPresenter } from './models';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient) { }


  public login(user: string, password: string) {
    let usersPresenters = new UsersPresenter(
      user,
      password,
      "",
      []
    );
    return this.http.post(ambiente.urlServicioRest + 'login', usersPresenters);
  }


  public isLogged() {
    if (sessionStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

}

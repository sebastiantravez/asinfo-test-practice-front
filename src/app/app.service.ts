import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ambiente } from '../environments/environment'
import { EmployeePresenter, UsersPresenter } from './models';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  validador: boolean;

  constructor(public http: HttpClient) { }

  isLogged() {
    if (sessionStorage.getItem('user') != null) {
      return true;
    }
    return false;
  }

  login(user: string, password: string) {
    let usersPresenters = new UsersPresenter(
      null,
      user,
      password,
      "",
      []
    );
    return this.http.post(ambiente.urlServicioRest + 'login', usersPresenters);
  }

  getDepartments() {
    return this.http.get<any>(ambiente.urlServicioRest + 'getAllDepartments');
  }

  getCharges() {
    return this.http.get<any>(ambiente.urlServicioRest + 'getAllCharges');
  }

  saveEmployee(employeePresenter: EmployeePresenter) {
    return this.http.post(ambiente.urlServicioRest + "saveEmployee", employeePresenter);
  }

  getAllEmployees(idSupervisor: string) {
    return this.http.get<any[]>(ambiente.urlServicioRest + 'getAllEmployees?id=' + idSupervisor);
  }

  updateEmployee(employeePresenter: EmployeePresenter) {
    return this.http.post(ambiente.urlServicioRest + 'updateEmployee', employeePresenter);
  }

  deleteEmployee(idEmployee: string) {
    return this.http.get(ambiente.urlServicioRest + 'deleteEmployee?id=' + idEmployee);
  }

  validateDni(cedula: String): boolean {
    let cedulaCorrecta = false;
    if (cedula.length == 10) {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      if (tercerDigito < 6) {
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(cedula.substring(9, 10));
        let suma: number = 0;
        let digito: number = 0;
        for (let i = 0; i < (cedula.length - 1); i++) {
          digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
        }
        suma = Math.round(suma);
        if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
          cedulaCorrecta = true;
        } else if ((10 - (Math.round(suma % 10))) == verificador) {
          cedulaCorrecta = true;
        } else {
          return cedulaCorrecta = false;
        }
      } else {
        return cedulaCorrecta = false;
      }
    } else {
      return cedulaCorrecta = false;
    }
    return this.validador = cedulaCorrecta;
  }


}

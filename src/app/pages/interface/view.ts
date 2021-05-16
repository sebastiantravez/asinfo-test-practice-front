import { FormGroup } from "@angular/forms";
import { Credentials, CrudValidations, RolesPresenter, UsersPresenter } from "src/app/models";
import Swal from "sweetalert2";
import { IdentificationType } from "./identificationtype";


export interface View {
  identificationType: IdentificationType[];
  crudValidations: CrudValidations;
  credentials: Credentials;
  users: UsersPresenter;
  registerForm: FormGroup;
  emailPattern: any;
  departments: any;
  charges: any;
  resp: boolean;
  employees: any[];
  alertMessages: AlertMessages;
  isDisabled: boolean;
}

export class AlertMessages {

  invalidFormError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Formulario de registro invalido, verifique los campos',
    });
  }

  sucessCreateForm() {
    Swal.fire(
      'Alerta',
      'Registro creado',
      'success'
    );
  }

  sucessUpdateForm() {
    Swal.fire(
      'Alerta',
      'Registro actualizado',
      'success'
    );
  }

  sucessDeleteForm() {
    Swal.fire(
      'Alerta',
      'Registro Eliminado',
      'success'
    );
  }

  error500Form() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Numero de identificacion o email ya existen',
    });
  }

  errorForm() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al registrar intente mas tarde !',
    });
  }

  credentialsInvalids() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Credenciales incorrectas',
    });
  }

}

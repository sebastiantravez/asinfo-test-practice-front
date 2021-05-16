import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { BusinessPresenter, ChargesPresenter, Credentials, CrudValidations, DepartmentPresenter, EmployeePresenter, UsersPresenter } from 'src/app/models';
import { Business } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ChargesType, EnumMessages, EnumUsersRoles, StateEmployee } from '../enums/messages';
import { IdentificationType } from '../interface/identificationtype';
import { View } from '../interface/view';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, View {

  crudValidations: CrudValidations;
  credentials: Credentials;
  users: UsersPresenter;
  identificationType: IdentificationType[] = [
    { name: 'CEDULA', code: 'DNI' },
    { name: 'RUC', code: 'RUC' },
    { name: 'PASAPORTE', code: 'PASSPORT' }
  ];
  registerForm: FormGroup;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  departments: any;
  charges: any;
  resp: boolean = true;
  employees: any[] = [];

  constructor(public router: Router, public formBuilder: FormBuilder, public appService: AppService) { }

  ngOnInit(): void {
    this.crudValidations = new CrudValidations(true, false, false);
    this.users = JSON.parse(sessionStorage.getItem('user'));
    if (this.users.usersRolesPresenters.length > 1) {
      this.credentials = new Credentials(
        EnumMessages.TITTLEADMIN + " " + this.users.userName,
        EnumUsersRoles.ADMIN
      );
    } else if (this.users.usersRolesPresenters.filter(x => x.name = EnumUsersRoles.SUPER_USER).length > 0) {
      this.credentials = new Credentials(
        EnumMessages.TITTLESUPERVIOR + " " + this.users.userName,
        EnumUsersRoles.SUPER_USER
      );
    } else {
      this.credentials = new Credentials(
        EnumMessages.TITTLEMPLOYEE + " " + this.users.userName,
        EnumUsersRoles.INVITED
      );
      return;
    }
    this.getDepartments();
    this.getCharges();
    this.getAllEmployees();
    this.registerForm = this.formBuilder.group({
      'idEmployee': ['',],
      'fullName': ['', Validators.compose([Validators.required])],
      'identificationType': ['', Validators.compose([Validators.required])],
      'identificationNumber': ['', Validators.compose([Validators.required])],
      'department': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'salary': ['', Validators.compose([Validators.required])],
      'date': ['', Validators.compose([Validators.required])]
    });
  }

  getDepartments() {
    this.appService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  getCharges() {
    this.appService.getCharges().subscribe(data => {
      this.charges = data;
    });
  }

  get email() { return this.registerForm.get('email') }

  closeSession() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  registerEmployee() {
    this.resp = this.appService.validateDni(this.registerForm.value.identificationNumber);
    if (this.registerForm.valid) {
      this.appService.saveEmployee(this.getEmployeeValuesForm()).subscribe(data => {
        this.sucessCreateForm();
        this.registerForm.reset();
        this.getAllEmployees();
      }, (err: any) => {
        if (err.status === 500) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Numero de identificacion o email ya existen',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al registrar intente mas tarde !',
          });
        }
      });
    } else {
      this.invalidFormError();
    }
  }

  getEmployeeValuesForm(): EmployeePresenter {
    const businessPresenter = new BusinessPresenter(Business.idBusiness, null);
    const chargesPresenter = new ChargesPresenter(null, ChargesType.OPERATOR);
    const departmentPresenter = new DepartmentPresenter(this.registerForm.value.department, "");
    const employee = new EmployeePresenter(
      this.registerForm.value.idEmployee,
      this.registerForm.value.fullName,
      this.registerForm.value.salary,
      this.registerForm.value.email,
      this.registerForm.value.identificationType,
      this.registerForm.value.identificationNumber,
      this.registerForm.value.date,
      StateEmployee.ACTIVE,
      businessPresenter,
      chargesPresenter,
      this.users,
      departmentPresenter
    );

    return employee;
  }

  clear() {
    this.crudValidations.buttonCreate = true;
    this.crudValidations.buttonUpdate = false;
    this.registerForm.reset();
  }


  getAllEmployees() {
    this.appService.getAllEmployees(this.users.idUser).subscribe(data => {
      this.employees = data;
    });
  }

  editEmployee(employee: EmployeePresenter) {
    this.registerForm.reset();
    this.resp = true;
    this.crudValidations = new CrudValidations(false, true, false);
    this.registerForm.get('idEmployee').setValue(employee.idEmployee);
    this.registerForm.get('fullName').setValue(employee.fullName);
    this.registerForm.get('identificationType').setValue(employee.identificationType);
    this.registerForm.get('identificationNumber').setValue(employee.identificationNumber);
    this.registerForm.get('department').setValue(employee.departmentPresenter.idDepartment);
    this.registerForm.get('email').setValue(employee.email);
    this.registerForm.get('salary').setValue(employee.salary);
    this.registerForm.get('date').setValue(employee.date);
  }

  updateEmployee() {
    if (this.registerForm.valid) {
      this.appService.updateEmployee(this.getEmployeeValuesForm()).subscribe(data => {
        this.sucessUpdateForm();
        this.getAllEmployees();
        this.crudValidations = new CrudValidations(true, false, false);
        this.registerForm.reset();
      });
    } else {
      this.invalidFormError();
    }
  }

  deleteEmploye(employee: EmployeePresenter) {
    Swal.fire({
      title: 'Alerta',
      text: "Desea eliminar el registro ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appService.deleteEmployee(employee.idEmployee).subscribe(data => {
          this.sucessDeleteForm();
          this.getAllEmployees();
        });
      }
    })
  }

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

  generatePdf() {
    this.appService.getReportPdf().subscribe(data => {
      this.showPdf(data);
    });
  }

  showPdf(data) {
    const pdfAsDataUri = 'data:application/pdf;base64,' + data.pdf;
    const array = this.convertDataURIToBinary(pdfAsDataUri);
    const pdfByte = new Blob([array], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(pdfByte);

    const a: HTMLAnchorElement = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
  }

  convertDataURIToBinary(dataURI) {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}
}

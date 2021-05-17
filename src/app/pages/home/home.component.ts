import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { BusinessPresenter, ChargesPresenter, Credentials, CrudValidations, DepartmentPresenter, EmployeePresenter, RolesPresenter, UsersPresenter } from 'src/app/models';
import { NgxSpinner } from 'src/app/services/ngxspinner.service';
import { Business } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ChargesType, EnumMessages, EnumUsersRoles, StateEmployee } from '../enums/messages';
import { IdentificationType } from '../interface/identificationtype';
import { AlertMessages, View } from '../interface/view';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, View {

  rolesPresenter: RolesPresenter[] = [];

  constructor(public router: Router, public formBuilder: FormBuilder,
    public appService: AppService, public spinner: NgxSpinner) { }
  
  resp = true;
  employees = [];
  alertMessages = new AlertMessages();
  isDisabled = false;
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
    }
    this.getDepartments();
    this.getCharges();
    this.getAllEmployees();
    this.getAllRoles();
    this.registerForm = this.formBuilder.group({
      'idEmployee': ['',],
      'fullName': ['', Validators.compose([Validators.required]), this.isDisabled],
      'identificationType': ['', Validators.compose([Validators.required])],
      'identificationNumber': ['', Validators.compose([Validators.required])],
      'department': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'salary': ['', Validators.compose([Validators.required])],
      'date': ['', Validators.compose([Validators.required])]
    });
  }

  getAllRoles(){
    this.appService.getAllRoles().subscribe(data => {
      this.rolesPresenter = data;
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

  registerEmployee() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.identificationType == 'DNI') {
        this.resp = this.appService.validateDni(this.registerForm.value.identificationNumber);
        if (!this.resp) { return }
      }
      this.appService.saveEmployee(this.getEmployeeValuesForm()).subscribe(data => {
        this.alertMessages.sucessCreateForm();
        this.registerForm.reset();
        this.getAllEmployees();
        this.resp = true;
      }, (err: any) => {
        if (err.status === 500) {
          this.alertMessages.error500Form();
        } else {
          this.alertMessages.errorForm();
        }
      });
    } else {
      this.alertMessages.invalidFormError();
    }
  }

  getEmployeeValuesForm(): EmployeePresenter {
    const rolSupervisor = this.rolesPresenter.filter(item => item.name == EnumUsersRoles.INVITED);
    const userData = new UsersPresenter(
      this.users.idUser,
      this.users.userName,
      "",
      "",
      this.users.usersRolesPresenters,
      rolSupervisor
    );
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
      userData,
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
    const datePipe = new DatePipe("en-US");
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
    this.registerForm.get('date').setValue(datePipe.transform(employee.date, 'yyyy-MM-dd'));
  }

  updateEmployee() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.identificationType == 'DNI') {
        this.resp = this.appService.validateDni(this.registerForm.value.identificationNumber);
        if (!this.resp) { return }
      }
      this.appService.updateEmployee(this.getEmployeeValuesForm()).subscribe(data => {
        this.alertMessages.sucessUpdateForm();
        this.getAllEmployees();
        this.crudValidations = new CrudValidations(true, false, false);
        this.registerForm.reset();
        this.resp = true;
      });
    } else {
      this.alertMessages.invalidFormError();
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
          this.alertMessages.sucessDeleteForm();
          this.getAllEmployees();
        });
      }
    })
  }

  searchEmployees(event: any) {
    if (event.target.value.length <= 0) {
      this.getAllEmployees();
      return;
    }
    if (event.keyCode == 13) {
      this.spinner.showSpinner();
      this.appService.searchEmployees(event.target.value).subscribe(data => {
        if (data.length > 0) {
          this.employees = data;
        }
      });
    }
  }



}

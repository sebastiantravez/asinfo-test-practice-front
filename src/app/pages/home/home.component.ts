import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { BusinessPresenter, ChargesPresenter, DepartmentPresenter, EmployeePresenter, UsersPresenter } from 'src/app/models';
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

  tittle: string = "";
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

  constructor(public router: Router, public formBuilder: FormBuilder, public appService: AppService) { }

  ngOnInit(): void {
    this.users = JSON.parse(sessionStorage.getItem('user'));
    if (this.users.usersRolesPresenters.length > 1) {
      this.tittle = EnumMessages.TITTLEADMIN;
    } else if (this.users.usersRolesPresenters.filter(x => x.name = EnumUsersRoles.SUPER_USER)) {
      this.tittle = EnumMessages.TITTLESUPERVIOR;
    }
    this.getDepartments();
    this.getCharges();
    this.registerForm = this.formBuilder.group({
      'fullName': ['', Validators.compose([Validators.required])],
      'identificationType': ['', Validators.compose([Validators.required])],
      'department': ['', Validators.compose([Validators.required])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'identificationNumber': ['', Validators.compose([Validators.required])],
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
      const businessPresenter = new BusinessPresenter(Business.idBusiness, null);
      const chargesPresenter = new ChargesPresenter(null,ChargesType.OPERATOR);
      const departmentPresenter = new DepartmentPresenter(this.registerForm.value.department,"");
      let employee = new EmployeePresenter(
        '',
        this.registerForm.value.fullName,
        this.registerForm.value.salary,
        this.registerForm.value.identificationType,
        this.registerForm.value.identificationNumber,
        this.registerForm.value.date,
        StateEmployee.ACTIVE,
        businessPresenter,
        chargesPresenter,
        this.users,
        departmentPresenter
      );
      this.appService.saveEmployee(employee).subscribe(data => {
        console.log(data);
      },(err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '' + err.error,
        })
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Formulario de registro invalido, verifique los campos',
      });
    }
  }



}

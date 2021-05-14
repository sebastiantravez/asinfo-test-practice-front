import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { UsersPresenter } from 'src/app/models';
import { EnumMessages, EnumUsersRoles } from '../enums/messages';
import { IdentificationType } from '../interface/identification-type';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tittle: string = "";
  users: any;
  identificationType: IdentificationType[] = [
    { name: 'CEDULA', code: 'DNI' },
    { name: 'RUC', code: 'RUC' },
    { name: 'PASAPORTE', code: 'PASSPORT' }
  ];
  registerForm: FormGroup;
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  date: any;
  radioItems: Array<string>;
  model = { option: 'option3' };
  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(public router: Router, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.users = JSON.parse(sessionStorage.getItem('user'));
    if (this.users.usersRolesPresenters.length > 1) {
      this.tittle = EnumMessages.TITTLEADMIN;
    } else if (this.users.usersRolesPresenters.filter(x => x.name = EnumUsersRoles.SUPER_USER)) {
      this.tittle = EnumMessages.TITTLESUPERVIOR;
    }

    this.radioItems = ['DNI', 'RUC', 'PASSPORT'];
    this.registerForm = this.formBuilder.group({
      'fullName': ['', Validators.compose([Validators.required])],
      'identificationType': ['', Validators.compose([Validators.required])],
      //'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'identificationNumber': ['', Validators.compose([Validators.required])],
      'salary': ['', Validators.compose([Validators.required])],
      'date': ['', Validators.compose([Validators.required])]
    });
  }

  closeSession() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  updateDate(event) {
    var datePipe = new DatePipe("en-US");
    this.date = datePipe.transform(event.value, 'MMM-dd-yyyy');
  }

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }


}

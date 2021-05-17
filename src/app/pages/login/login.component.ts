import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { RolesPresenter, UsersPresenter } from 'src/app/models';
import { NgxSpinner } from 'src/app/services/ngxspinner.service';
import Swal from 'sweetalert2';
import { EnumUsersRoles } from '../enums/messages';
import { AlertMessages } from '../interface/view';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  alertMessages = new AlertMessages();
  loginForm: FormGroup;

  constructor(public appService: AppService, public router: Router, public spinner: NgxSpinner,
    public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'user': ['',],
      'password': ['',],
    });
  }

  login() {
    if (this.loginForm.value.user == "" || this.loginForm.value.password == "") {
      return;
    }
    this.appService.login(this.loginForm.value.user, this.loginForm.value.password).subscribe((data: UsersPresenter) => {
      if (data != null) {
        sessionStorage.setItem('user', JSON.stringify(data));
        this.spinner.showSpinner();
        if (data.usersRolesPresenters.length > 0) {
          if (data.usersRolesPresenters.filter(x => x.name == EnumUsersRoles.ADMIN).length > 0) {
            this.router.navigate(['home/employee-admin']);
          } else if (data.usersRolesPresenters.filter(x => x.name == EnumUsersRoles.SUPER_USER).length > 0) {
            this.router.navigate(['/home']);
          }
        } else {
          this.router.navigate(['home/employee-invited']);
        }
        return;
      }
      this.alertMessages.credentialsInvalids();
    });
  }

}

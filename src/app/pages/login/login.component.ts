import { Component, OnInit } from '@angular/core';
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

  user: string = "";
  password: string = "";
  alertMessages = new AlertMessages();

  constructor(public appService: AppService, public router: Router, public spinner: NgxSpinner) { }

  ngOnInit(): void {
  }

  login() {
    if (this.user == "" || this.password == "") {
      return;
    }
    this.appService.login(this.user, this.password).subscribe((data: UsersPresenter) => {
      if (data != null) {
        sessionStorage.setItem('user', JSON.stringify(data));
        this.spinner.showSpinner();
        if (data.usersRolesPresenters.length > 0) {
          if (data.usersRolesPresenters.filter(x => x.name == EnumUsersRoles.ADMIN).length > 0) {
            this.router.navigate(['home/employee-admin']);
          } else if (data.usersRolesPresenters.filter(x => x.name == EnumUsersRoles.SUPER_USER).length > 0) {
            this.router.navigate(['home']);
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

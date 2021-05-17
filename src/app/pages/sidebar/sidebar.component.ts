import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Credentials, UsersPresenter } from 'src/app/models';
import { NgxSpinner } from 'src/app/services/ngxspinner.service';
import { EnumMessages, EnumUsersRoles } from '../enums/messages';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  users: UsersPresenter;
  credentials: Credentials;
  constructor(public router: Router, public spinner: NgxSpinner, public appService: AppService) { }

  ngOnInit(): void {
    this.users = JSON.parse(sessionStorage.getItem('user'));
    if (this.users.usersRolesPresenters.length > 1) {
      this.credentials = new Credentials(
        EnumMessages.TITTLEADMIN + " " + this.users.userName,
        EnumUsersRoles.ADMIN
      );
    } else if (this.users.usersRolesPresenters.filter(x => x.name == EnumUsersRoles.SUPER_USER).length > 0) {
      this.credentials = new Credentials(
        EnumMessages.TITTLESUPERVIOR + " " + this.users.userName,
        EnumUsersRoles.SUPER_USER
      );
    } else {
      this.credentials = new Credentials(
        EnumMessages.TITTLEMPLOYEE + " " + this.users.userName,
        EnumUsersRoles.INVITED
      );
    }
  }

  closeSession() {
    this.spinner.showSpinner();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  generatePdf() {
    this.spinner.showSpinnerPdf();
    this.appService.getReportPdf().subscribe(data => {
      this.spinner.hideSpinnerPdf();
      this.appService.showPdf(data);
    });
  }

}

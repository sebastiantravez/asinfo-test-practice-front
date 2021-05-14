import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user:string = "";
  password:string = "";

  constructor(public appService: AppService, public router: Router) { }

  ngOnInit(): void {
  }

  login(){
    if(this.user == "" || this.password == ""){
      return;
    }
    this.appService.login(this.user, this.password).subscribe(data => {
      this.router.navigate(['home']);
    });
  }

}

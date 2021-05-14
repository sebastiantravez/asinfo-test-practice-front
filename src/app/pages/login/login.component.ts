import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import Swal from 'sweetalert2';

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
      if(data != null){
        sessionStorage.setItem('user',JSON.stringify(data))
        this.router.navigate(['home']);
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Credenciales incorrectas',
      })
    });
  }

}

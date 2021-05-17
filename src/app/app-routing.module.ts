import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesupervisorComponent } from './pages/employeesupervisor/employeesupervisor.component';
import { CanActivateViaAuthGuard } from './pages/guards/CanActivateViaAuthGuard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      {
        path: '',
        component: SidebarComponent, children: [
          { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [CanActivateViaAuthGuard] },
          { path: 'home/employee-admin', component: EmployeesupervisorComponent, pathMatch: 'full', canActivate: [CanActivateViaAuthGuard] },
          { path: 'home/employee-invited', component: NotFoundComponent, pathMatch: 'full', canActivate: [CanActivateViaAuthGuard] },
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

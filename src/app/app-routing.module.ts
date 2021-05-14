import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateViaAuthGuard } from './pages/guards/CanActivateViaAuthGuard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [CanActivateViaAuthGuard] },
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

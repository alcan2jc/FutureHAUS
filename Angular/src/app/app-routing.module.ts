import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './_services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ControlComponent } from './control/control.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfoComponent } from './info/info.component';
import { ARComponent } from './ar/ar.component';

const routes: Routes = [
	{ path: '', component: WelcomeComponent, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent },
	{ path: 'control', component: ControlComponent },
	{ path: 'info', component: InfoComponent },
	{ path: 'ar', component: ARComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

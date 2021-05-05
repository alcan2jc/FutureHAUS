import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './_services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { ControlComponent } from './control/control.component';
import { WelcomeComponent } from './welcome/welcome.component';
// import { PowerComponent } from './power_info/power/power.component';
// import { BatteryComponent } from './power_info/battery/battery.component';
// import { PanelComponent } from './power_info/panel/panel.component';
// import { ChargecontrollerComponent } from './power_info/chargecontroller/chargecontroller.component';
// import { InverterComponent } from './power_info/inverter/inverter.component';
import { ARComponent } from './ar/ar.component';
import { InfoComponent } from './power_info/info.component';

const routes: Routes = [
	{ path: '', component: WelcomeComponent, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent },

	//MQTT commands
	{ path: 'control', component: ControlComponent },

	//Power Info
	{ path: 'info', component: InfoComponent },

	//Augmented Reality
	{ path: 'ar', component: ARComponent },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

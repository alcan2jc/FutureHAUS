import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ControlComponent } from './control/control.component';
import { PowerComponent } from './power_info/power/power.component';
import { ARComponent } from './ar/ar.component';
import { WelcomeComponent } from './welcome/welcome.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import { IgxButtonModule } from 'igniteui-angular';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ChartsModule } from 'ng2-charts';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import { BatteryComponent } from './power_info/battery/battery.component';
import { PanelComponent } from './power_info/panel/panel.component';
import { ChargecontrollerComponent } from './power_info/chargecontroller/chargecontroller.component';
import { InverterComponent } from './power_info/inverter/inverter.component';
import { InfoComponent } from './power_info//info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ControlComponent,
    PowerComponent,
    ARComponent,
    WelcomeComponent,
    BatteryComponent,
    PanelComponent,
    ChargecontrollerComponent,
    InverterComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, 
    IgxButtonModule, 
    MatButtonModule, 
    MatToolbarModule, 
    HttpClientModule, 
    MatSnackBarModule, 
    ChartsModule, 
    MatSidenavModule,
    ChartsModule,
    MatGridListModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

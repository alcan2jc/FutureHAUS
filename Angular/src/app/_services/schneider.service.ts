import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MqttService } from 'ngx-mqtt';

interface SchneiderData {
  dc_voltage: number[],
  pv_power: number,
  pv_current: string,
  pv_voltage: string
}

@Injectable({ providedIn: 'root' })
export class SchneiderService {

  private schneiderDataService: BehaviorSubject<SchneiderData>;
  public schneiderData: Observable<SchneiderData>;

  subscription: Subscription;
  schneiderDataJSON: any;
  constructor(private mqtt: MqttService) {
    this.schneiderDataService = new BehaviorSubject(null);
    this.schneiderData = this.schneiderDataService.asObservable();

    //Subscribe to MQTT topic
    this.subscription = this.mqtt.observe("FutureHAUS/Website/Battery").subscribe((msg) => {
      this.schneiderDataJSON = JSON.parse(msg.payload.toString());
    });
  }

  getScraped() {
    let data: SchneiderData = {
      dc_voltage: null,
      pv_power: null,
      pv_current: null,
      pv_voltage: null
    }

    data.dc_voltage = [+this.schneiderDataJSON.DC_Output_Voltage.slice(0, -2)];
    data.dc_voltage[0] = +data.dc_voltage[0].toPrecision(3);
    data.pv_power = +this.schneiderDataJSON.PV_POWER.slice(0, -2);
    data.pv_power *= 5;
    this.schneiderDataService.next(data);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

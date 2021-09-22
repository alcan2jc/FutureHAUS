import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MqttService } from 'ngx-mqtt';
import { SchneiderService } from './schneider.service';

interface PowerData {
  prod: [number, number],
  cons: [number, number],
  net: [number, number]
}

interface SchneiderData {
  dc_voltage: number[],
  pv_power: number,
  pv_current: string,
  pv_voltage: string
}

@Injectable({ providedIn: 'root' })
export class PowerService {

  private powerDataService: BehaviorSubject<PowerData>;
  public powerData: Observable<PowerData>;

  subscriptionCons: Subscription;
  subscriptionProd: Subscription;
  consumptionJSON: any;
  scraped: any;
  constructor(private mqtt: MqttService, private schneiderService: SchneiderService) {
    this.powerDataService = new BehaviorSubject(null);
    this.powerData = this.powerDataService.asObservable();

    //Subscribe to MQTT topic
    this.subscriptionCons = this.mqtt.observe("FutureHAUS/Website/Consumption").subscribe((msg) => {
      this.consumptionJSON = JSON.parse(msg.payload.toString());
    });

    this.subscriptionProd = this.schneiderService.schneiderData.subscribe((data: SchneiderData) => {
      this.scraped = data;
    });
  }

  getPower() {
    let x = (new Date().getTime());
    let prody = this.scraped.pv_power;
    let consy = this.consumptionJSON.ct0_power + this.consumptionJSON.ct1_power;

    let data: PowerData = {
      prod: [0, 0],
      cons: [0, 0],
      net: [0, 0]
    };
    data.prod = [x, prody];
    data.cons = [x, consy];
    data.net = [x, prody + consy];
    this.powerDataService.next(data);
  }

  ngOnDestroy() {
    if (this.subscriptionCons) {
      this.subscriptionCons.unsubscribe();
    }

    if (this.subscriptionProd) {
      this.subscriptionProd.unsubscribe();
    }
  }
}

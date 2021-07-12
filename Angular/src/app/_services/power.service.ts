import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MqttService } from 'ngx-mqtt';

interface PowerData {
  prod: [number, number],
  cons: [number, number],
  net: [number, number]
}

@Injectable({ providedIn: 'root' })
export class PowerService {

  private powerDataService: BehaviorSubject<PowerData>;
  public powerData: Observable<PowerData>;
  subscription: Subscription;
  results: any;
  constructor(private mqtt: MqttService) {
    this.powerDataService = new BehaviorSubject(null);
    this.powerData = this.powerDataService.asObservable();

    //Subscribe to MQTT topic
    let topic = "FutureHAUS/Website/Info";
    this.subscription = this.mqtt.observe(topic).subscribe((msg) => {
      this.results = JSON.parse(msg.payload.toString());
    });
  }

  getPower() {
    let x = (new Date()).getTime();
    let prody = this.results.ct0.power;
    let consy = -this.results.ct1.power;

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

  getBatteryVoltage() {

  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

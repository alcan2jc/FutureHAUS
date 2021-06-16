import { Injectable } from '@angular/core';
import { MqttService } from "ngx-mqtt";

@Injectable()
export class EventMqttService {

  private endpoint: string;

  constructor(
    private mqtt: MqttService,
  ) {
    this.mqtt.connect({ hostname: '192.168.0.160', port: 9001, path: '' });
  }
}
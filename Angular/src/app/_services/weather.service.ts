import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { parse } from 'node-html-parser';

interface Data {
    time: string[]
    temp: string[]
}

@Injectable({ providedIn: 'root' })
export class WeatherService {

    private dataSubject: BehaviorSubject<Data>;
    public data: Observable<Data>;

    constructor() {
        this.getData().then((data: Data) => this.dataSubject = new BehaviorSubject<Data>(data)).catch( (e) => console.log(e));
        this.data = this.dataSubject.asObservable();
    }

    async getData(): Promise<Data> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch("https://weather.com/weather/hourbyhour/l/f32f2d2e3156f59f830e0ec31299d884965f61dafac4c7b472390cfc20f076a0");
                const text = await response.text();
                const document = parse(text);
                let hours = [];
                let tmps = [];
                let items = document.querySelectorAll('.DetailsSummary--tempValue--RcZzi');

                items.forEach((item) => {
                    tmps.push(
                        item.innerText,
                    );
                });

                items = document.querySelectorAll('.DetailsSummary--daypartName--1Mebr');
                items.forEach((item) => {
                    hours.push(
                        item.innerHTML
                    );
                });

                let res: Data = {
                    time: hours,
                    temp: tmps,
                }

                return resolve(res);
            } catch (e) {
                return reject(e);
            }
        })
    }
}
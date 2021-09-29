import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as tf from "@tensorflow/tfjs";
import * as cocoSSD from '@tensorflow-models/coco-ssd';

@Component({
  selector: 'app-ar',
  templateUrl: './ar.component.html',
  styleUrls: ['./ar.component.scss']
})
export class ARComponent implements OnInit {

  @ViewChild('videoElement', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  video: HTMLVideoElement;
  reqID;
  which: string;
  model: tf.GraphModel;
  constructor() { }

  ngOnInit(): void {
    this.which = "";
    this.initCamera({ video: true, audio: false });
    this.predictWithCocoModel();
    // this.predict();
  }

  initCamera(config: any) {

    navigator.mediaDevices.getUserMedia(config).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      console.log(stream);
      this.videoElement.nativeElement.onloadedmetadata = () => {
        this.videoElement.nativeElement.play();
        this.video = this.videoElement.nativeElement;
        console.log(this.video);
      };
    },
      err => console.log("err:", err));
  }

  // public async predict()  {
  //   this.model = await tf.loadGraphModel('../assets/Model/web_model/model.json');
  //   // const result = await this.model.executeAsync(tf.zeros([1, 300, 300, 3])) as any;
  //   console.log(this.model);
  // }

  //Coco code here
  public async predictWithCocoModel() {
    const model = await cocoSSD.load();
    // setTimeout(() => {
    //   this.detectFrame(this.video, model);
    // }, 3000);
    // this.detectFrame(this.video, model);
  }

  detectFrame = (video, model) => {
    const t0 = performance.now();
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions, t0);
      this.reqID = requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  renderPredictions = (predictions, t0) => {
    const canvas = this.canvas.nativeElement;

    const ctx = canvas.getContext("2d");
    canvas.width = 750;
    canvas.height = 750;
    canvas.style.width = '500px';
    canvas.style.height = '500px';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Fonts
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.video, 0, 0, 750, 750);
    const t1 = performance.now();
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Bounding box
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Label background
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });
    predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);

      if (prediction.class === "keyboard") {
        this.which = "Inverter";
      } else if (prediction.class === "mouse") {
        this.which = "Battery";
      } else if (prediction.class === "remote") {
        this.which = "PV";
      }
      // Reminder: Turn power components to be one component for less work. 
      // console.log(prediction.class, `Took ${t1 - t0} milliseconds`);
    });
  };

  ngOnDestroy() {
    cancelAnimationFrame(this.reqID);
    // this.video.getVideoTracks().forEach(function (track) {
    //   track.stop();
    // });
  }
}



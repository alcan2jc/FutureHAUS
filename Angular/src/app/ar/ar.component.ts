import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as cocoSSD from "@tensorflow-models/coco-ssd";

@Component({
  selector: 'app-ar',
  templateUrl: './ar.component.html',
  styleUrls: ['./ar.component.scss']
})
export class ARComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;
  video: HTMLVideoElement;
  constructor() { }

  ngOnInit(): void {
    this.initCamera({ video: true, audio: false });
  }

  initCamera(config: any) {
    var browser = <any>navigator;
    // this.video = <HTMLVideoElement>document.getElementById("vid");
    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    browser.mediaDevices.getUserMedia(config).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.onloadedmetadata = () => {
        this.videoElement.nativeElement.play();
        this.video = this.videoElement.nativeElement;
        this.predictWithCocoModel();
      };
    });
  }

  public async predictWithCocoModel() {
    const model = await cocoSSD.load();
    this.detectFrame(this.video, model);
  }

  detectFrame = (video, model) => {
    const t0 = performance.now();
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions, t0);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  }

  renderPredictions = (predictions, t0) => {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    const ctx = canvas.getContext("2d");
    canvas.width = 750;
    canvas.height = 750;
    canvas.style.width = '750px';
    canvas.style.height = '750px';
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
      console.log(prediction.class, `Took ${t1 - t0} milliseconds`);
    });
  };

  ngOnDestroy() {
    this.video = null;
    this.videoElement.nativeElement.stop();
  }
}

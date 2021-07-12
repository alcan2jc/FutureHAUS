import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as tf from "@tensorflow/tfjs";
// import * as cocoSSD from '@tensorflow-models/coco-ssd';

export interface DetectedObject {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

@Component({
  selector: 'app-ar',
  templateUrl: './ar.component.html',
  styleUrls: ['./ar.component.scss']
})
export class ARComponent implements OnInit {

  @ViewChild('videoElement') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  video: HTMLVideoElement;
  reqID;
  model: tf.GraphModel;
  constructor() { }

  ngOnInit(): void {
    this.initCamera({ video: true, audio: false });
    this.loadModel();
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
      };
    });
  }

  async loadModel() {
    // await tf.loadGraphModel('../../assets/Model/web_model/model.json');
    

    // let zeros = tf.zeros([1, 300, 300, 3]);
    // const result = await this.model.executeAsync(zeros) as any;
    // await Promise.all(result.map(t => t.data()));
    // result.map(t => t.dispose());
    // this.predictImages(this.videoElement.nativeElement, this.model);
  }

  //   public async predictImages(video, model) {
  //     // this.detectFrame(this.video, model);
  //     const maxNumBoxes = 30;
  //     const batched = tf.tidy(() => {
  //       let img = this.canvas.nativeElement;
  //       if (!(img instanceof tf.Tensor)) {
  //         img = tf.browser.fromPixels(img);
  //         img = tf.cast(img, 'float32');
  //       }
  //       return img.expandDims(0);
  //     });
  //     const height = batched.shape[1];
  //     const width = batched.shape[2];
  //     const result = await this.model.executeAsync(batched) as tf.Tensor[];
  //     const scores = result[0].dataSync() as Float32Array;
  //     const boxes = result[1].dataSync() as Float32Array;

  //     batched.dispose();
  //     tf.dispose(result);

  //     const [maxScores, classes] = this.calculateMaxiumScore(scores, result[0].shape[1], result[0].shape[2]);
  //     const tensorIndex = tf.tidy(() => {
  //       // console.log("boxes:", boxes);
  //       // console.log("result[1].shape[1]", result[1].shape[1]);
  //       // console.log("result[1].shape[3]:", result[1].shape[2]);
  //       const boxes2 = tf.tensor2d(boxes, [result[1].shape[1], result[1].shape[2]]);
  //       return tf.image.nonMaxSuppression(boxes2, maxScores, maxNumBoxes, 0.5, 0.5);
  //     });
  //     const index = tensorIndex.dataSync() as Float32Array;
  //     tensorIndex.dispose();
  //     const output = this.generateOutputObject(width, height, boxes, maxScores, index, classes);
  //     if (output.length > 0) {
  //       this.renderPredictions(output);
  //     } else {
  //       this.renderCameraVideo();
  //     }
  //     requestAnimationFrame(() => {
  //       this.predictImages(video, model);
  //     });
  //   }

  generateOutputObject(width: number, height: number, boxes: Float32Array, scores: number[], index: Float32Array, classes: number[]): DetectedObject[] {

    const count = index.length;
    const objects: DetectedObject[] = [];
    for (let i = 0; i < count; i++) {
      const bbox = [];
      for (let j = 0; j < 4; j++) {
        bbox[j] = boxes[index[i] * 4 + j];
      }
      const minY = bbox[0] * height;
      const minX = bbox[1] * width;
      const maxY = bbox[2] * height;
      const maxX = bbox[3] * width;
      bbox[0] = minX;
      bbox[1] = minY;
      bbox[2] = maxX - minX;
      bbox[3] = maxY - minY;
      objects.push({
        bbox: bbox as [number, number, number, number],
        class: (classes[index[i]] + 1).toString(),
        score: scores[index[i]]
      });
    }
    return objects;
  }

  // function is defined to find the optimum max score.
  calculateMaxiumScore(scores: Float32Array, numBoxes: number, numClasses: number) {

    const maxes = [];
    const classes = [];
    for (let i = 0; i < numBoxes; i++) {
      let max = Number.MIN_VALUE;
      let index = -1;
      for (let j = 0; j < numClasses; j++) {
        if (scores[i * numClasses + j] > max) {
          max = scores[i * numClasses + j];
          index = j;
        }
      }
      maxes[i] = max;
      classes[i] = index;
    }
    return [maxes, classes];
  }

  // function is defined to draw bbox on the canvas
  renderPredictions(predictions: any) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext("2d");
    canvas.width = 350;
    canvas.height = 450;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.textBaseline = "top";
    ctx.drawImage(this.videoElement.nativeElement, 0, 0, 350, 450);
    const data = canvas.toDataURL('image/png');

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      if (prediction.class) {
        ctx.strokeStyle = "#FF0000";
        ctx.fillStyle = "#FF0000";
      }
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();
      // Draw the label background.
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt("16px sans-serif", 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    // for rendering class name over the rect
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      if (prediction.class) {
        ctx.fillStyle = "#FFFFFF";
      }
      ctx.fillText(prediction.class, x, y);
    });

  }

  // render the video if no prediction is found
  renderCameraVideo() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    canvas.width = 350;
    canvas.height = 450;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(this.videoElement.nativeElement, 0, 0, 350, 450);

  }
}

//   //Coco code here
//   // public async predictWithCocoModel() {
//   //   const model = await cocoSSD.load();
//   //   this.detectFrame(this.video, model);
//   // }

//   // detectFrame = (video, model) => {
//   //   const t0 = performance.now();
//   //   model.detect(video).then(predictions => {
//   //     this.renderPredictions(predictions, t0);
//   //     this.reqID = requestAnimationFrame(() => {
//   //       this.detectFrame(video, model);
//   //     });
//   //   });
//   // }

//   // renderPredictions = (predictions, t0) => {
//   //   const canvas = this.canvas.nativeElement;

//   //   const ctx = canvas.getContext("2d");
//   //   canvas.width = 750;
//   //   canvas.height = 750;
//   //   canvas.style.width = '750px';
//   //   canvas.style.height = '750px';
//   //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//   //   // Fonts
//   //   const font = "16px sans-serif";
//   //   ctx.font = font;
//   //   ctx.textBaseline = "top";
//   //   ctx.drawImage(this.video, 0, 0, 750, 750);
//   //   const t1 = performance.now();
//   //   predictions.forEach(prediction => {
//   //     const x = prediction.bbox[0];
//   //     const y = prediction.bbox[1];
//   //     const width = prediction.bbox[2];
//   //     const height = prediction.bbox[3];
//   //     // Bounding box
//   //     ctx.strokeStyle = "#00FFFF";
//   //     ctx.lineWidth = 2;
//   //     ctx.strokeRect(x, y, width, height);
//   //     // Label background
//   //     ctx.fillStyle = "#00FFFF";
//   //     const textWidth = ctx.measureText(prediction.class).width;
//   //     const textHeight = parseInt(font, 10); // base 10
//   //     ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
//   //   });
//   //   predictions.forEach(prediction => {

//   //     const x = prediction.bbox[0];
//   //     const y = prediction.bbox[1];
//   //     ctx.fillStyle = "#000000";
//   //     ctx.fillText(prediction.class, x, y);
//   //     console.log(prediction.class, `Took ${t1 - t0} milliseconds`);
//   //   });
//   // };

//   ngOnDestroy() {
//     cancelAnimationFrame(this.reqID);
//     this.videoElement.nativeElement.srcObject.getTracks().forEach(function (track) {
//       track.stop();
//     });
//   }
// }



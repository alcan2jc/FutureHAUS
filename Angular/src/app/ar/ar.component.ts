import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as tf from "@tensorflow/tfjs";
import * as cocoSSD from '@tensorflow-models/coco-ssd';
import { loadGraphModel } from '@tensorflow/tfjs-converter';
tf.setBackend('webgl');
// tf.ENV.set('WEBGL_PACK', false);

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
  buttonInput: string;
  buttonX: string;
  buttonY: string;
  model: tf.GraphModel;
  style: string;
  classesDir: object;
  threshold: Number;
  constructor() { }

  ngOnInit(): void {
    //Component vars
    this.style = "width: 50vw; height: 85vh; margin: 1px; border: 1px solid #555";
    this.classesDir = {
      1: {
        name: 'Inverter',
        id: 1,
      },
      2: {
        name: 'Other',
        id: 2,
      }
    }
    this.threshold = 0.75;
    this.which = "";
    this.initCamera({ video: true, audio: false });
    // this.predictWithCocoModel();
    this.predict();
  }

  initCamera(config: any) {
    navigator.mediaDevices.getUserMedia(config).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.onloadedmetadata = () => {
        this.videoElement.nativeElement.play();
        this.video = this.videoElement.nativeElement;
      };
    },
      err => console.log("err:", err));
  }

  async loadModel() {
    // const model = await cocoSSD.load();
    // const model = await loadGraphModel("https://raw.githubusercontent.com/trangml/futureHAUS-TFJS-object-detection/master/models/tf2_web_model/model.json");
    this.model = await loadGraphModel("../../assets/model/model.json");
    // return model;
  }


  //Coco code here
  public async predictWithCocoModel() {
    const model = await cocoSSD.load();
    setTimeout(() => {
      this.detectFrameCoco(this.video, model);
    }, 2000);
  }

  public async predict() {
    // this.model = this.loadModel();
    this.model = await loadGraphModel("../../assets/model/model.json");
    setTimeout(() => {
      this.detectFrame(this.video, this.model);
    }, 3000);
  }

  //Coco Model detectFrame
  detectFrameCoco = (video, model) => {
    const t0 = performance.now();
    model.detect(video).then(predictions => {
      this.renderPredictionsCoco(predictions, t0);
      this.reqID = requestAnimationFrame(() => {
        this.detectFrameCoco(video, model);
      });
    });
  }

  // Power system model detectFrame
  detectFrame = (video, model) => {
    console.log("1");
    tf.engine().startScope();
    console.log("2");
    model.executeAsync(this.process_input(video)).then(predictions => {
      console.log("pred", predictions);
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
      tf.engine().endScope();
    });
  };

  process_input(video_frame) {
    const tfimg = tf.browser.fromPixels(video_frame).toInt();
    const expandedimg = tfimg.transpose([0, 1, 2]).expandDims();
    return expandedimg;
  };

  buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
    const detectionObjects = [];
    var video_frame = document.getElementById('frame');
    scores[0].forEach((score, i) => {
      if (score[1] > threshold) {
        const bbox = [];
        const minY = boxes[0][i][0] * video_frame.offsetHeight;
        const minX = boxes[0][i][1] * video_frame.offsetWidth;
        const maxY = boxes[0][i][2] * video_frame.offsetHeight;
        const maxX = boxes[0][i][3] * video_frame.offsetWidth;
        bbox[0] = minX;
        bbox[1] = minY;
        bbox[2] = maxX - minX;
        bbox[3] = maxY - minY;
        detectionObjects.push({
          class: classes[i],
          label: classesDir[classes[i]].name,
          score: score[1].toFixed(4),
          bbox: bbox
        })
      }
    })
    return detectionObjects
  }

  //For Coco (renderPredictions)
  renderPredictionsCoco = (predictions, t0) => {
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
      console.log(prediction.class, "detected in", t1 - t0, "milliseconds");
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Bounding box
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      let xoffset = width / 4;
      let yoffset = height / 4;
      ctx.strokeRect(x + (xoffset), y + (yoffset), width, height);
      // Label background
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x + xoffset, y + yoffset, textWidth, textHeight);
    });

    predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      let xoffset = width / 4;
      let yoffset = height / 4;
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x + xoffset, y + yoffset);

      if (prediction.class === "person") {
        this.buttonX = x + xoffset;
        this.buttonY = y + height / 2;
        this.buttonInput = "inverter";
        // canvas.style.display='none';
      } else if (prediction.class === "cell phone") {
        this.buttonX = x + xoffset;
        this.buttonY = y + height / 2;
        this.buttonInput = "battery";
      } else if (prediction.class === "remote") {
        this.which = "pv";
      } else if (prediction.class === "person") {
        this.which = "inverter";
        canvas.style.display = "block";
      }
      // Reminder: Turn power components to be one component for less work. 
      console.log(prediction.class, `Took ${t1 - t0} milliseconds`);
    });
  };

  renderPredictions = (predictions) => {
    const ctx = this.canvas.nativeElement.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    //Getting predictions
    // These indexes work for the tf1 model converted using tfjs_wiz 3.9
    // const num_detections = predictions[0].dataSync();
    // const boxes = predictions[5].arraySync();
    // const scores = predictions[1].arraySync();
    // const classes = predictions[4].arraySync();
    // const detections = this.buildDetectedObjectsTF1(num_detections, scores, threshold,
    // boxes, classes, classesDir);

    // These indexes work for the tf2 model converted using tfjs_wiz 3.9
    const boxes = predictions[7].arraySync();
    const scores = predictions[2].arraySync();
    const classes = predictions[6].dataSync();
    const detections = this.buildDetectedObjects(scores, this.threshold,
      boxes, classes, this.classesDir);

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];
      const width = item['bbox'][2];
      const height = item['bbox'][3];

      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%", x, y);
    });
  };

  buttonClicked(event) {
    this.which = event.srcElement.innerText;
  }

  buttonStyle() {
    return "z-index:2; position:absolute; top:" + this.buttonY + "px; " + "left:" + this.buttonX + "px;";
  }
  ngOnDestroy() {
    cancelAnimationFrame(this.reqID);
    // this.video.getVideoTracks().forEach(function (track) {
    //   track.stop();
    // });
  }
}



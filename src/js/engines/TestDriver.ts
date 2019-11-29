import PointList from "./buffers/PointList";
import { AtomicBind } from "./buffers/types";
import CanvasTexture from "./buffers/CanvasTexture";
import RenderTexture from "./buffers/RenderTexture";

export interface Input {
  readonly x: number
  readonly y: number
  readonly values: string
}

export interface Output {
  readonly x: number
  readonly y: number
  readonly values: string
}

export default class TestDriver {
  readonly buttonPoints: PointList;
  readonly testPoints: PointList;
  readonly expectedResultTexture: CanvasTexture;
  readonly testResultTexture: RenderTexture;
  constructor(gl: WebGLRenderingContext, vertexBind: AtomicBind, frameBufferBind: AtomicBind) {
    this.buttonPoints = new PointList(gl, vertexBind);
    this.testPoints = new PointList(gl, vertexBind);
    this.expectedResultTexture = new CanvasTexture(gl, 2, 2);
    this.testResultTexture = new RenderTexture(gl, frameBufferBind, 2, 2, true);
  }

  update(inputs: Input[], outputs: Output[]) {
    const samples = [...inputs, ...outputs].map(i => i.values.replace(/\s/g, ''));

    const width = Math.max(...samples.map(s => s.length));
    const height = inputs.length + outputs.length;

    this.testResultTexture.resize(width, height);
    this.expectedResultTexture.resize(width, height);

    this.expectedResultTexture.ctx.fillStyle = '#8888';
    this.expectedResultTexture.ctx.fillRect(0, 0, width, height);

    this.testPoints.set(0, [...outputs].reverse());
    this.buttonPoints.set(outputs.length, [...inputs].reverse());

    let y = samples.length;
    for (const input of samples) {
      y--;
      this.drawLines(input, y);
    }

    this.expectedResultTexture.update();
  }

  drawLines(values: string, y: number) {
    values = values.replace(/\s/g, '');

    for (let x = 0; x < values.length;) {
      let length = 1;
      while (values[x] === values[x + length]) {
        length++;
      }
      this.expectedResultTexture.setExpectation(values[x] as any, y, x, length);
      x += length;
    }
  }
}
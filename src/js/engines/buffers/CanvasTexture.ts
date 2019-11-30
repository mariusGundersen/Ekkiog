import { vec2 } from 'gl-matrix';

import Texture from './Texture';

export default class CanvasTexture extends Texture {
  private readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  constructor(gl: WebGLRenderingContext, width: number, height = width) {
    super(gl, width, height);

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  resize(width: number, height = width) {
    vec2.set(this.size, width, height);
    vec2.set(this.halfSize, width / 2, height / 2);
    vec2.set(this.inverseSize, 1 / width, 1 / height);

    this.canvas.width = width;
    this.canvas.height = height;

    this.update();
  }

  update() {
    this.bindTexture();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.canvas);
  }

  setExpectation(v: '1' | '0' | 'x', y: number, from: number, width: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = v == '1' ? '#fff' : v == '0' ? '#000' : '#888';
    this.ctx.lineCap = 'butt';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(from, y + .5);
    this.ctx.lineTo(from + width, y + .5);
    this.ctx.stroke();
  }
}
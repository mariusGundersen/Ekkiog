import { vec2 } from 'gl-matrix';

import Texture from './Texture';

export default class CanvasTexture extends Texture {
  private readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  constructor(gl: WebGLRenderingContext, width: number, height: number) {
    super(gl, width, height);

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, width, height);

    this.setExpectation('0', 1, 0, 4);
    this.setExpectation('0', 2, 0, 4);
    this.setExpectation('x', 0, 0, 3);
    this.setExpectation('0', 0, 3, 1);

    this.setExpectation('1', 1, 4, 4);
    this.setExpectation('0', 2, 4, 4);
    this.setExpectation('x', 0, 4, 3);
    this.setExpectation('1', 0, 7, 1);

    this.setExpectation('1', 1, 8, 4);
    this.setExpectation('1', 2, 8, 4);
    this.setExpectation('x', 0, 8, 3);
    this.setExpectation('0', 0, 11, 1);

    this.setExpectation('0', 1, 12, 4);
    this.setExpectation('1', 2, 12, 4);
    this.setExpectation('x', 0, 12, 3);
    this.setExpectation('1', 0, 15, 1);

    this.update();
  }

  resize(width: number, height: number) {
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

  private setExpectation(v: '1' | '0' | 'x', y: number, from: number, width: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = v == '1' ? '#aaa' : v == '0' ? '#333' : '#686868';
    this.ctx.lineCap = 'butt';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(from, y + .5);
    this.ctx.lineTo(from + width, y + .5);
    this.ctx.stroke();
  }
}
import ndarray, { NdArray } from 'ndarray';
import Texture from './Texture';

export default class DataTexture extends Texture {
  private readonly data: Uint8Array;
  private readonly data32: Uint32Array;
  private readonly map: NdArray;
  constructor(gl: WebGLRenderingContext, width: number, height = width) {
    super(gl, width, height);
    this.data = new Uint8Array(width * height * 4);
    this.data32 = new Uint32Array(this.data.buffer);
    this.map = ndarray(this.data32, [width, height]);

    this.update();
  }

  set(x: number, y: number, v: number) {
    this.map.set(y, x, v);
  }

  get(x: number, y: number) {
    return this.map.get(y, x, 0);
  }

  update() {
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.data);
  }
}
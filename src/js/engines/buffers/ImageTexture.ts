import { vec2 } from 'gl-matrix';

import Texture from './Texture';

export default class ImageTexture extends Texture {
  constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
    super(gl, image.width, image.height);

    vec2.set(this.size, image.width, image.height);
    vec2.set(this.halfSize, image.width / 2, image.height / 2);
    vec2.set(this.inverseSize, 1 / image.width, 1 / image.height);

    this.update(image);
  }

  update(image: HTMLImageElement) {
    this.bindTexture();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  }
}
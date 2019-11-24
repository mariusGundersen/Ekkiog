import { vec2 } from 'gl-matrix';

import Texture from './Texture';

export default class ImageTexture extends Texture {
  constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
    super(gl, image.width, image.height);

    this.bindTexture();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  }
}
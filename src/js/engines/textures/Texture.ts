import {vec2} from 'gl-matrix';

import { TextureBuffer } from './types';

export default class Texture implements TextureBuffer {
  readonly gl : WebGLRenderingContext;
  readonly texture : WebGLTexture;
  width : number;
  height : number;
  readonly size : vec2;
  readonly halfSize : vec2;
  readonly inverseSize : vec2;
  constructor(gl : WebGLRenderingContext, width=0, height=0){
    this.gl = gl;
    this.texture = gl.createTexture() || (() => {throw new Error("Could not make texture")})();

    this.width = width;
    this.height = height;

    this.size = vec2.fromValues(width, height);
    this.halfSize = vec2.fromValues(width/2, height/2);
    this.inverseSize = vec2.fromValues(1/width, 1/height);

    this.bind();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
  }

  bind(){
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  sampler2D(target : number){
    this.gl.activeTexture(target + this.gl.TEXTURE0);
    this.bind();
    return target;
  }
}
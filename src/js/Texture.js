
import {vec2} from 'gl-matrix';

export default class Texture{
  constructor(gl, id, image = {width:0, height: 0}){
    this.gl = gl;
    this.id = id;
    this.texture = gl.createTexture();
    this.image = image;

    this.width = image.width;
    this.height = image.height;

    this.size = vec2.fromValues(image.width, image.height);
    this.inverseSize = vec2.create(1/image.width, 1/image.height);

    this.gl.activeTexture(this.id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  }

  setImage(image){
    this.image = image;

    this.gl.activeTexture(this.id);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

    this.size[0] = image.width;
    this.size[1] = image.height;

    this.inverseSize[0] = 1/image.width;
    this.inverseSize[1] = 1/image.height;
  }
}

import {vec2} from 'gl-matrix';

export default class Texture{
  constructor(gl, id, size = {width:0, height: 0}){
    this.gl = gl;
    this.id = id;
    this.texture = gl.createTexture();

    this.width = size.width;
    this.height = size.height;

    this.size = vec2.fromValues(size.width, size.height);
    this.halfSize = vec2.fromValues(size.width/2, size.height/2);
    this.inverseSize = vec2.fromValues(1/size.width, 1/size.height);

    this.activate();
    this.bind();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
  }

  activate(){
    this.gl.activeTexture(this.id);
  }

  bind(){
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  get sampler2D(){
    switch(this.id){
      case this.gl.TEXTURE0:
        return 0;
      case this.gl.TEXTURE1:
        return 1;
      case this.gl.TEXTURE2:
        return 2;
      default:
        return -1;
    }
  }

  setImage(image){
    this.activate();
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

    this.width = image.width;
    this.height = image.height;

    vec2.set(this.size, image.width, image.height);
    vec2.set(this.halfSize, image.width/2, image.height/2);
    vec2.set(this.inverseSize, 1/image.width, 1/image.height);
  }

  setData(data){
    this.activate();
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
  }
}
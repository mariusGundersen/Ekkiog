
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

  setImage(image){
    this.activate();
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

    this.width = image.width;
    this.height = image.height;

    this.size[0] = image.width;
    this.size[1] = image.height;

    this.halfSize[0] = image.width/2;
    this.halfSize[1] = image.height/2;

    this.inverseSize[0] = 1/image.width;
    this.inverseSize[1] = 1/image.height;
  }

  setData(data){
    this.activate();
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, data);
  }
}
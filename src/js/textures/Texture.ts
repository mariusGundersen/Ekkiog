import {vec2} from 'gl-matrix';

export default class Texture{

  gl : WebGLRenderingContext;
  texture : WebGLTexture;
  width : number;
  height : number;
  size : vec2;
  halfSize : vec2;
  inverseSize : vec2;
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

  activate(target : number){
    this.gl.activeTexture(target + this.gl.TEXTURE0);
  }

  bind(){
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  sampler2D(target : number){
    this.activate(target);
    this.bind();
    return target;
  }
}

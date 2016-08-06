import ndarray from 'ndarray';
import Texture from './Texture.js';

export default class DataTexture extends Texture{
  constructor(gl, width, height){
    super(gl, width, height);
    this.data = new Uint8Array(width*height*4);
    this.data32 = new Uint32Array(this.data.buffer);
    this.map32 = ndarray(this.data32, [height, width]);

    this.update();
  }

  set(x, y, v){
    this.map32.set(y, x, v);
  }

  get(x, y){
    return this.map32.get(y, x, 0);
  }

  update(){
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.data);
  }

  import(arrayBuffer){
    this.data.set(arrayBuffer);
    this.update();
  }

  export(){
    return this.data;
  }
}
import ndarray from 'ndarray';
import Texture from './Texture.js';

export default class DataTexture extends Texture{
  constructor(gl, width, height){
    super(gl, width, height);
    this.data = new Uint8Array(width*height*4);
    this.map = ndarray(this.data, [height, width, 4]);

    this.update();
  }

  set(x, y, v=1){
    this.map.set(y, x, 0, v);
  }

  get(x, y){
    return this.map.get(y, x, 0) || 0;
  }

  toggle(x, y){
    this.set(x, y, this.get(x, y) ? 0 : 1);
  }

  update(){
    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.data);
  }
}
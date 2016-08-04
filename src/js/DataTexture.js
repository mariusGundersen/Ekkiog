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

  set16(x, y, v=0){
    this.map.set(y, x, 0, (v>>0)&0xff)
    this.map.set(y, x, 1, (v>>8)&0xff);
  }

  set32(x, y, v=0){
    this.map.set(y, x, 0, (v>>0)&0xff)
    this.map.set(y, x, 1, (v>>8)&0xff);
    this.map.set(y, x, 2, (v>>16)&0xff);
    this.map.set(y, x, 3, (v>>24)&0xff);
  }

  get(x, y){
    return this.map.get(y, x, 0);
  }

  get16(x, y){
    return (this.map.get(y, x, 0)<<0)
         | (this.map.get(y, x, 1)<<8);
  }

  get32(x, y){
    return (this.map.get(y, x, 0)<<0)
         | (this.map.get(y, x, 1)<<8)
         | (this.map.get(y, x, 2)<<16)
         | (this.map.get(y, x, 3)<<32);
  }

  toggle(x, y){
    this.set(x, y, this.get(x, y) ? 0 : 1);
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
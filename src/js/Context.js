import DataTexture from './DataTexture.js';

export default class Context{
  constructor(gl, width, height, tileSize){
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;

    this.mapTexture = new DataTexture(gl, width, height);
    this.tileMapTexture = new DataTexture(gl, width, height);
    this.chargeMapTexture = new DataTexture(gl, width, height);
  }

  import(data){
    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        this.mapTexture.set(x, y, data[y*this.height + x]);
      }
    }

    this.mapTexture.update();
  }

  export(){
    const data = [];

    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        data[y*this.height + x] = this.mapTexture.get(x, y);
      }
    }

    return {
      width: this.width,
      height: this.height,
      data: data
    };
  }
}
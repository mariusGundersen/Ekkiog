import {encode as encodeArray, decode as decodeArary} from 'base64-arraybuffer';

import DataTexture from './DataTexture.js';
import RenderTexture from './RenderTexture.js';

import ImageTexture from './ImageTexture.js';
import loadImage from './loadImage.js';
import tiles from '../img/tiles.png';


export default class Context{
  constructor(gl, data, tileSize){
    this.gl = gl;
    this.width = data.width;
    this.height = data.height;
    this.tileSize = tileSize;

    this.spriteSheetTexture = new ImageTexture(gl, loadImage(tiles));
    this.mapTexture = new DataTexture(gl, this.width, this.height);
    this.tileMapTexture = new RenderTexture(gl, this.width, this.height);
    this.chargeMapTexture = new RenderTexture(gl, this.width, this.height);
    this.netMapTexture = new DataTexture(gl, this.width, this.height);
    this.netChargeTextures = [
      new RenderTexture(gl, 256, 256),
      new RenderTexture(gl, 256, 256)
    ];
    this.gatesTexture = new DataTexture(gl, 256, 256);

    this.import(data);
  }

  import(data){
    if(data.map) this.mapTexture.import(deserialize(data.map));
    if(data.netMap) this.netMapTexture.import(deserialize(data.netMap));
    if(data.gates) this.gatesTexture.import(deserialize(data.gates));
    if(data.netCharges) this.netChargeTextures[0].import(deserialize(data.netCharges));
    if(data.netCharges) this.netChargeTextures[1].import(deserialize(data.netCharges));
  }

  export(){
    return {
      width: this.width,
      height: this.height,
      map: serialize(this.mapTexture.export()),
      netMap: serialize(this.netMapTexture.export()),
      gates: serialize(this.gatesTexture.export()),
      netCharges: serialize(this.netChargeTextures[0].export()),
    };
  }
}

function serialize(inputArray){
  const array = new Uint32Array(inputArray.buffer);
  const content = [];
  for(let i=0; i<array.length; i++){
    let repeats = 1;
    const value = array[i];
    while(i+1 < array.length && array[i+1] === value){
      i++;
      repeats++;
    }
    if(repeats>1){
      content.push(`#${repeats.toString(16)}x${value.toString(16)}`);
    }else{
      content.push(value.toString(16));
    }
  }
  return `(32)${array.length.toString(16)}:${content.join(',')}`
}

function deserialize(string){
  const [sizeAndLength, content] = string.split(':');
  const output = sizeAndLength.match(/\(32\)\d+/)
    ? new Uint32Array(parseInt(/\(32\)(\d+)/.exec(sizeAndLength)[1], 16))
    : new Uint8Array(parseInt(sizeAndLength, 16));
  let i=0;
  for(let item of content.split(',')){
    if(item[0] == '#'){
      const [_, repeatString, valueString] = /#([0-9a-f]+)x([0-9a-f]+)/.exec(item);
      const value = parseInt(valueString, 16);
      const repeats = parseInt(repeatString, 16);
      if(value === '0'){
        i+= repeats;
      }else{
        for(let r=0; r<repeats; r++, i++){
          output[i] = value;
        }
      }
    }else{
      output[i++] = parseInt(item, 16);
    }
  }
  return new Uint8Array(output.buffer);
}
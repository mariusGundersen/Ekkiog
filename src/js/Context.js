import {encode as encodeArray, decode as decodeArary} from 'base64-arraybuffer';

import DataTexture from './DataTexture.js';
import RenderTexture from './RenderTexture.js';

export default class Context{
  constructor(gl, data, tileSize){
    this.gl = gl;
    this.width = data.width;
    this.height = data.height;
    this.tileSize = tileSize;

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

function serialize(array){
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
  return `${array.length.toString(16)}:${content.join(',')}`
}

function deserialize(string){
  const [length, content] = string.split(':');
  const output = new Uint8Array(parseInt(length, 16));
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
  return output;
}
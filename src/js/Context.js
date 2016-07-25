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
    if(data.map) this.mapTexture.import(new Uint8Array(decodeArary(data.map)));
    if(data.netMap) this.netMapTexture.import(new Uint8Array(decodeArary(data.netMap)));
    if(data.gates) this.gatesTexture.import(new Uint8Array(decodeArary(data.gates)));
    if(data.netCharges) this.netChargeTextures[0].import(new Uint8Array(decodeArary(data.netCharges)));
    if(data.netCharges) this.netChargeTextures[1].import(new Uint8Array(decodeArary(data.netCharges)));
  }

  export(){
    return {
      width: this.width,
      height: this.height,
      map: encodeArray(this.mapTexture.export()),
      netMap: encodeArray(this.netMapTexture.export()),
      gates: encodeArray(this.gatesTexture.export()),
      netCharges: encodeArray(this.netChargeTextures[0].export()),
    };
  }
}
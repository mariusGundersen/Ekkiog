import {encode as encodeArray, decode as decodeArary} from 'base64-arraybuffer';
import {createTree} from 'ennea-tree';

import serialize from './storage/serialize.js';
import deserialize from './storage/deserialize.js';

import DataTexture from './textures/DataTexture.js';
import RenderTexture from './textures/RenderTexture.js';

import ImageTexture from './textures/ImageTexture.js';
import loadImage from './loadImage.js';
import tiles from '../img/tiles.png';


export default class Context{
  constructor(gl, data, tileSize=16){
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
    this.enneaTree = createTree(this.width);

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
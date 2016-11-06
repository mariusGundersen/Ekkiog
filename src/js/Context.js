import {encode as encodeArray, decode as decodeArary} from 'base64-arraybuffer';

import serialize from './storage/serialize.js';
import deserialize from './storage/deserialize.js';

import DataTexture from './textures/DataTexture.js';
import RenderTexture from './textures/RenderTexture.js';

import ImageTexture from './textures/ImageTexture.js';
import loadImage from './loadImage.js';
import tiles from '../img/tiles.png';

const SQRT_NET_COUNT = 256;

export default class Context{
  constructor(gl, mapSize=128, tileSize=16){
    this.gl = gl;
    this.width = mapSize;
    this.height = mapSize;
    this.tileSize = tileSize;

    this.spriteSheetTexture = new ImageTexture(gl, loadImage(tiles));
    this.mapTexture = new DataTexture(gl, mapSize, mapSize);
    this.tileMapTexture = new RenderTexture(gl, mapSize, mapSize);
    this.chargeMapTexture = new RenderTexture(gl, mapSize, mapSize);
    this.netMapTexture = new DataTexture(gl, mapSize, mapSize);
    this.netChargeTextures = [
      new RenderTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT),
      new RenderTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT)
    ];
    this.gatesTexture = new DataTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT);
  }
}
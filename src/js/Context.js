import DataTexture from './textures/DataTexture.js';
import RenderTexture from './textures/RenderTexture.js';
import ImageTexture from './textures/ImageTexture.js';

import QuadList from './textures/QuadList.js';

import loadImage from './loadImage.js';
import tiles from '../img/tiles.png';

const MAP_SIZE = 128;
const TILE_SIZE = 16;
const SQRT_NET_COUNT = 256;
const WORD_TEXTURE_SIZE = 64;

export default class Context{
  constructor(gl){
    this.gl = gl;
    this.width = MAP_SIZE;
    this.height = MAP_SIZE;
    this.tileSize = TILE_SIZE;

    this.wordQuadList = new QuadList(gl, 16);

    this.spriteSheetTexture = new ImageTexture(gl, loadImage(tiles));
    this.wordTexture = new RenderTexture(gl, WORD_TEXTURE_SIZE, WORD_TEXTURE_SIZE);

    this.mapTexture = new DataTexture(gl, MAP_SIZE, MAP_SIZE);
    this.netMapTexture = new DataTexture(gl, MAP_SIZE, MAP_SIZE);
    this.gatesTexture = new DataTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT);

    this.tileMapTexture = new RenderTexture(gl, MAP_SIZE, MAP_SIZE);
    this.chargeMapTexture = new RenderTexture(gl, MAP_SIZE, MAP_SIZE);
    this.netChargeTextures = [
      new RenderTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT),
      new RenderTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT)
    ];
  }
}
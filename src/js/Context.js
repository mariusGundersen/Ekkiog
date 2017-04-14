import DataTexture from './textures/DataTexture.js';
import RenderTexture from './textures/RenderTexture.js';
import ImageTexture from './textures/ImageTexture.js';

import QuadList from './textures/QuadList.js';
import TextScene from './text/TextScene';

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

    this.wordQuadList = new QuadList(gl, 256);
    this.textScene = new TextScene(this.wordQuadList);

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

  setMap(x, y, tile){
    this.mapTexture.set(x, y, tile);
  }

  setNet(x, y, net){
    this.netMapTexture.set(x, y, net);
  }

  setGate(v, a, b){
    this.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
  }

  insertText(item, area){
    this.textScene.insertItem(item, area);
  }

  removeText(item){
    this.textScene.removeItem(item);
  }

  updateText(before, after){
    this.textScene.updateItem(before, after);
  }

  updateDataTextures(){
    this.mapTexture.update();
    this.netMapTexture.update();
    this.gatesTexture.update();
    this.wordQuadList.update();
  }
}
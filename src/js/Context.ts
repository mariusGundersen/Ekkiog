import { MutableContext, Item, Area } from 'ekkiog-editing';

import DataTexture from './textures/DataTexture';
import RenderTexture from './textures/RenderTexture';
import ImageTexture from './textures/ImageTexture';

import QuadList from './textures/QuadList';
import TextScene from './text/TextScene';

import loadImage from './loadImage';
import tiles from '../img/tiles.png';

const MAP_SIZE = 128;
const TILE_SIZE = 16;
const SQRT_NET_COUNT = 256;

export default class Context implements MutableContext{
  gl : WebGLRenderingContext;
  width : number;
  height : number;
  tileSize : number;
  wordQuadList : QuadList;
  textScene : TextScene;
  spriteSheetTexture : ImageTexture;
  mapTexture : DataTexture;
  netMapTexture : DataTexture;
  gatesTexture : DataTexture;
  tileMapTexture : RenderTexture;
  chargeMapTexture : RenderTexture;
  netChargeTextures : [RenderTexture, RenderTexture];
  constructor(gl : WebGLRenderingContext){
    this.gl = gl;
    this.width = MAP_SIZE;
    this.height = MAP_SIZE;
    this.tileSize = TILE_SIZE;

    this.wordQuadList = new QuadList(gl, 256);
    this.textScene = new TextScene(this.wordQuadList);

    this.spriteSheetTexture = new ImageTexture(gl, loadImage(tiles));

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

  setMap(x : number, y : number, tile : number){
    this.mapTexture.set(x, y, tile);
  }

  setNet(x : number, y : number, net : number){
    this.netMapTexture.set(x, y, net);
  }

  setGate(v : number, a : number, b : number){
    this.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
  }

  insertText(item : Item, area : Area){
    this.textScene.insertItem(item, area);
  }

  removeText(item : Item){
    this.textScene.removeItem(item);
  }

  updateText(before : Item, after : Item){
    this.textScene.updateItem(before, after);
  }

  updateDataTextures(){
    this.mapTexture.update();
    this.netMapTexture.update();
    this.gatesTexture.update();
    this.wordQuadList.update();
  }
}
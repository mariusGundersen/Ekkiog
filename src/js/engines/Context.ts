import { MutableContext as IMutableContext, Item, Area } from 'ekkiog-editing';

import { VertexBuffer, RenderContext, AtomicBind } from './textures/types';

import DataTexture from './textures/DataTexture';
import RenderTexture from './textures/RenderTexture';
import ImageTexture from './textures/ImageTexture';

import Triangle from './textures/Triangle';
import QuadList from './textures/QuadList';
import TextScene from './text/TextScene';

import loadImage from '../loadImage';
import tiles from '../../img/tiles.png';

const MAP_SIZE = 128;
const TILE_SIZE = 16;
const SQRT_NET_COUNT = 256;

const SpriteSheet = loadImage(tiles);

export default class Context implements RenderContext {
  private readonly gl : WebGLRenderingContext;
  private readonly width : number;
  private readonly height : number;
  readonly tileSize : number;
  readonly triangle : Triangle;
  readonly wordQuadList : QuadList;
  readonly textScene : TextScene;
  readonly spriteSheetTexture : ImageTexture;
  readonly mapTexture : DataTexture;
  readonly netMapTexture : DataTexture;
  readonly gatesTexture : DataTexture;
  readonly tileMapTexture : RenderTexture;
  readonly chargeMapTexture : RenderTexture;
  readonly netChargeTextures : [RenderTexture, RenderTexture];
  constructor(gl : WebGLRenderingContext, bindingTracker : AtomicBind){
    this.gl = gl;
    this.width = MAP_SIZE;
    this.height = MAP_SIZE;
    this.tileSize = TILE_SIZE;

    this.triangle = new Triangle(bindingTracker, gl);
    this.wordQuadList = new QuadList(bindingTracker, gl);
    this.textScene = new TextScene(this.wordQuadList);

    this.spriteSheetTexture = new ImageTexture(gl, SpriteSheet);

    this.mapTexture = new DataTexture(gl, MAP_SIZE);
    this.netMapTexture = new DataTexture(gl, MAP_SIZE);
    this.gatesTexture = new DataTexture(gl, SQRT_NET_COUNT);

    this.tileMapTexture = new RenderTexture(gl, MAP_SIZE);
    this.chargeMapTexture = new RenderTexture(gl, MAP_SIZE);
    this.netChargeTextures = [
      new RenderTexture(gl, SQRT_NET_COUNT, gl.RGB),
      new RenderTexture(gl, SQRT_NET_COUNT, gl.RGB)
    ];
  }

  mutateContext(mutator : (mutableContext : MutableContext) => void){
    const mutableContext = new MutableContext(this);
    mutator(mutableContext);
    mutableContext.update();
    return mutableContext.changed;
  }
}

export class MutableContext implements IMutableContext {
  private readonly context : Context;
  private textChanged : boolean;
  private mapChanged : boolean;
  private netChanged : boolean;
  private gateChanged : boolean;
  constructor(context : Context) {
    this.context = context;
    this.textChanged = false;
    this.mapChanged = false;
    this.netChanged = false;
    this.gateChanged = false;
  }

  get changed(){
    return this.textChanged
        || this.mapChanged
        || this.netChanged
        || this.gateChanged;
  }
  setMap(x : number, y : number, tile : number) {
    this.context.mapTexture.set(x, y, tile);
    this.mapChanged = true;
  }

  setNet(x : number, y : number, net : number){
    this.context.netMapTexture.set(x, y, net);
    this.netChanged = true;
  }

  setGate(v : number, a : number, b : number){
    this.context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
    this.gateChanged = true;
  }

  toggleGate(v : number){
    const s = this.context.gatesTexture.get((v>>0)&0xff, (v>>8)&0xff);
    const a = s === 0 ? (1<<16) | 1 : 0;
    this.context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, a);
    this.gateChanged = true;
  }

  insertText(item : Item, area : Area){
    this.context.textScene.insertItem(item, area);
    this.textChanged = true;
  }

  removeText(item : Item){
    this.context.textScene.removeItem(item);
    this.textChanged = true;
  }

  updateText(before : Item, after : Item){
    this.context.textScene.updateItem(before, after);
    this.textChanged = true;
  }

  update(){
    if(this.mapChanged){
      this.context.mapTexture.update();
    }
    if(this.netChanged){
      this.context.netMapTexture.update();
    }
    if(this.gateChanged){
      this.context.gatesTexture.update();
    }
    if(this.textChanged){
      this.context.wordQuadList.update();
    }
  }
}

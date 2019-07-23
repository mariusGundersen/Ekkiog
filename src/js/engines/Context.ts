import { MutableContext as IMutableContext, Item, Area } from '../editing';

import { RenderContext, AtomicBind } from './textures/types';

import DataTexture from './textures/DataTexture';
import RenderTexture from './textures/RenderTexture';
import ImageTexture from './textures/ImageTexture';

import PointList from './textures/PointList';
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
  readonly tileSize: number;
  readonly testPoints: PointList;
  readonly triangle: Triangle;
  readonly wordQuads: QuadList;
  readonly textScene: TextScene;
  readonly spriteSheetTexture: ImageTexture;
  readonly mapTexture: DataTexture;
  readonly netMapTexture: DataTexture;
  readonly gatesTexture: DataTexture;
  readonly tileMapTexture: RenderTexture;
  readonly chargeMapTexture: RenderTexture;
  readonly netChargeTextures: [RenderTexture, RenderTexture];
  readonly expectedResultTexture: DataTexture;
  readonly testResultTexture: RenderTexture;
  constructor(gl: WebGLRenderingContext, bindingTracker: AtomicBind) {
    this.tileSize = TILE_SIZE;

    this.testPoints = new PointList(bindingTracker, gl);
    this.triangle = new Triangle(bindingTracker, gl);
    this.wordQuads = new QuadList(bindingTracker, gl);
    this.textScene = new TextScene(this.wordQuads);

    this.spriteSheetTexture = new ImageTexture(gl, SpriteSheet);

    this.mapTexture = new DataTexture(gl, MAP_SIZE);
    this.netMapTexture = new DataTexture(gl, MAP_SIZE);
    this.gatesTexture = new DataTexture(gl, SQRT_NET_COUNT);

    this.tileMapTexture = new RenderTexture(gl, MAP_SIZE);
    this.chargeMapTexture = new RenderTexture(gl, MAP_SIZE);
    this.netChargeTextures = [
      new RenderTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT, gl.RGB),
      new RenderTexture(gl, SQRT_NET_COUNT, SQRT_NET_COUNT, gl.RGB)
    ];

    this.expectedResultTexture = new DataTexture(gl, 256, 8);
    this.testResultTexture = new RenderTexture(gl, 256, 8);
  }

  mutateContext(mutator: (mutableContext: MutableContext) => void) {
    const mutableContext = new MutableContext(this);
    mutator(mutableContext);
    mutableContext.update();
    return mutableContext.changed;
  }
}

export class MutableContext implements IMutableContext {
  private readonly context: Context;
  private textChanged: boolean;
  private mapChanged: boolean;
  private netChanged: boolean;
  private gateChanged: boolean;
  private setGates: Set<number>;
  constructor(context: Context) {
    this.context = context;
    this.textChanged = false;
    this.mapChanged = false;
    this.netChanged = false;
    this.gateChanged = false;
    this.setGates = new Set<number>();
  }

  get changed() {
    return this.textChanged
      || this.mapChanged
      || this.netChanged
      || this.gateChanged;
  }

  setMap(x: number, y: number, tile: number) {
    this.context.mapTexture.set(x, y, tile);
    this.mapChanged = true;
  }

  setNet(x: number, y: number, net: number) {
    this.context.netMapTexture.set(x, y, net);
    this.netChanged = true;
  }

  setGate(v: number, a: number, b: number) {
    this.context.gatesTexture.set((v >> 0) & 0xff, (v >> 8) & 0xff, (a << 16) | (b << 0));
    this.gateChanged = true;
    this.setGates.add(v);
  }

  setGateA(v: number, a: number) {
    const x = (v >> 0) & 0xff;
    const y = (v >> 8) & 0xff;
    const e = this.context.gatesTexture.get(x, y);
    this.context.gatesTexture.set(x, y, (a << 16) | (e & 0xffff));
    this.gateChanged = true;
    this.setGates.add(v);
  }

  setGateB(v: number, b: number) {
    const x = (v >> 0) & 0xff;
    const y = (v >> 8) & 0xff;
    const e = this.context.gatesTexture.get(x, y);
    this.context.gatesTexture.set(x, y, b | (e & 0xffff0000));
    this.gateChanged = true;
    this.setGates.add(v);
  }

  clearGate(v: number) {
    if (this.setGates.has(v)) return;
    this.setGate(v, 0, 0);
  }

  toggleGate(v: number) {
    const s = this.context.gatesTexture.get((v >> 0) & 0xff, (v >> 8) & 0xff);
    const a = s === 0 ? (1 << 16) | 1 : 0;
    this.context.gatesTexture.set((v >> 0) & 0xff, (v >> 8) & 0xff, a);
    this.gateChanged = true;
  }

  insertText(item: Item, area: Area) {
    this.context.textScene.insertItem(item, area);
    this.textChanged = true;
  }

  removeText(item: Item) {
    this.context.textScene.removeItem(item);
    this.textChanged = true;
  }

  updateText(before: Item, after: Item) {
    this.context.textScene.updateItem(before, after);
    this.textChanged = true;
  }

  update() {
    if (this.mapChanged) {
      this.context.mapTexture.update();
    }
    if (this.netChanged) {
      this.context.netMapTexture.update();
    }
    if (this.gateChanged) {
      this.context.gatesTexture.update();
    }
    if (this.textChanged) {
      this.context.wordQuads.update();
    }
  }
}

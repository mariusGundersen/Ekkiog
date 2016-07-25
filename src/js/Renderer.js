import ViewEngine from './view/ViewEngine.js';
import TileMapEngine from './tileMap/TileMapEngine.js';
import ChargeMapEngine from './chargeMap/ChargeMapEngine.js';
import NetChargeEngine from './netCharges/NetChargeEngine.js';
import Perspective from './Perspective.js';
import Context from './Context.js';
import Editor from './editing/Editor.js';

const TILE_SIZE = 16;

export default class Renderer {
  constructor(gl, storage) {
    this.storage = storage;
    const loaded = storage.load() || {width: 128, height: 128, data: []};
    this.context = new Context(gl, loaded.width, loaded.height, TILE_SIZE);
    this.editor = new Editor(this.context);
    this.context.import(loaded.data);

    this.context.mapTexture.set(65, 66, 2);
    this.context.netMapTexture.set(65, 66, 2);

    this.context.mapTexture.set(75, 60, 2);
    this.context.netMapTexture.set(75, 60, 3);

    this.context.mapTexture.set(75, 66, 2);
    this.context.netMapTexture.set(75, 66, 4);

    this.netChargeEngine = new NetChargeEngine(gl, this.context);
    this.context.gatesTexture.update();
    this.netChargeEngine.render(0);

    this.chargeMapEngine = new ChargeMapEngine(gl, this.context);
    this.context.netMapTexture.update();
    this.chargeMapEngine.render(0);

    this.tileMapEngine = new TileMapEngine(gl, this.context);
    this.context.mapTexture.update();
    this.tileMapEngine.render();

    this.perspective = new Perspective(this.context);
    this.viewEngine = new ViewEngine(gl, this.context, this.perspective.mapToViewportMatrix);
  }

  resize (width, height) {
    this.perspective.setViewport(width, height);
  }

  scaleBy(scale){
    this.perspective.scaleBy(scale);
  }

  translateBy(x, y){
    this.perspective.translateBy(x, y);
  }

  tap(x, y){
    const [tx, ty] = this.perspective.viewportToMap(x, y);
    console.log(x, y, tx, ty);
    window.requestAnimationFrame(() => {
      if(this.editor.query.isWire(tx, ty)){
        this.editor.clear(tx, ty);
      }else{
        this.editor.drawWire(tx, ty);
      }
      this.tileMapEngine.render();
      this.storage.save(this.context.export());
    });
  }

  tick(tick){
    this.netChargeEngine.render(tick);
    this.chargeMapEngine.render(tick);
  }

  draw(gl) {
    gl.viewport(0, 0, this.perspective.viewportSize[0], this.perspective.viewportSize[1]);

    this.viewEngine.render();
  }
}

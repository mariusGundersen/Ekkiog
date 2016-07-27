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
    this.tool = 'wire';
    this.storage = storage;
    const loaded = storage.load() || {width: 128, height: 128};
    this.context = new Context(gl, loaded, TILE_SIZE);
    this.editor = new Editor(this.context);

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
    this.perspective.scale = TILE_SIZE*this.context.width/width;
  }

  panZoom(previous, next){
    this.perspective.panZoom(previous, next);
  }

  setSelectedTool(tool){
    this.tool = tool;
  }

  tap(x, y){
    const [tx, ty] = this.perspective.viewportToTile(x, y);
    console.log(x, y, tx, ty);
    window.requestAnimationFrame(() => {
      if(this.tool == 'wire'){
        if(this.editor.query.isWire(tx, ty)){
          this.editor.clearWire(tx, ty);
        }else{
          this.editor.drawWire(tx, ty);
        }
      }else if(this.tool == 'underpass'){
        this.editor.drawUnderpass(tx, ty);
      }else if(this.tool == 'gate'){
        this.editor.drawGate(tx, ty);
      }else{
        this.editor.clear(tx, ty);
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

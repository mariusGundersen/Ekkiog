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
    this.currentTick = 0;
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

  resize (width, height, screenWidth, screenHeight) {
    this.perspective.setViewport(width, height);
    this.perspective.scale = TILE_SIZE*this.context.width/screenWidth;
  }

  panZoom(previous, next){
    this.perspective.panZoom(previous, next);
  }

  setSelectedTool(tool){
    this.tool = tool;
  }

  tap(x, y){
    const [tx, ty] = this.perspective.viewportToTile(x, y);

    window.requestAnimationFrame(() => {
      if(this.editor.query.isButton(tx, ty)){
        const [netX, netY] = this.editor.toggleButton(tx, ty);
        this.context.gatesTexture.update();
        const netCharges = this.context.netChargeTextures[this.currentTick%2].export();
        netCharges[(0 + netY*4)*this.context.width + netX] = 0xff;
        netCharges[(1 + netY*4)*this.context.width + netX] = 0xff;
        netCharges[(2 + netY*4)*this.context.width + netX] = 0xff;
        netCharges[(3 + netY*4)*this.context.width + netX] = 0xff;
        this.context.netChargeTextures[this.currentTick%2].import(netCharges);
        this.netChargeEngine.render(this.currentTick);
        this.chargeMapEngine.render(this.currentTick);
        this.storage.save(this.context.export());
      }else{
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
        }else if(this.tool == 'button'){
          this.editor.drawButton(tx, ty);
        }else{
          this.editor.clear(tx, ty);
        }

        this.tileMapEngine.render();
        this.storage.save(this.context.export());
        this.chargeMapEngine.render(this.currentTick);
      }
    });
  }

  longPress(x, y){
    const [tx, ty] = this.perspective.viewportToTile(x, y);

    window.requestAnimationFrame(() => {
      if(this.editor.query.isGate(tx, ty)){
        const [gateX, gateY] = this.editor.query.getGateOutput(tx, ty);
        this.editor.clearGate(gateX, gateY);
      }else if(this.editor.query.isButton(tx, ty)){
        const [buttonX, buttonY] = this.editor.query.getButtonOutput(tx, ty);
        this.editor.clearButton(buttonX, buttonY);
      }else if(this.editor.query.isWire(tx, ty)){
        this.editor.drawUnderpass(tx, ty);
      }else if(this.editor.query.isUnderpass(tx, ty)){
        this.editor.drawWire(tx, ty);
      }

      this.tileMapEngine.render();
      this.storage.save(this.context.export());
      this.chargeMapEngine.render(this.currentTick);
    });
  }

  tick(tick){
    this.currentTick = tick;
    this.netChargeEngine.render(tick);
    this.chargeMapEngine.render(tick);
  }

  draw(gl) {
    gl.viewport(0, 0, this.perspective.viewportSize[0], this.perspective.viewportSize[1]);

    this.viewEngine.render();
  }
}

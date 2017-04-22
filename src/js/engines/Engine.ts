import { mat3 } from 'gl-matrix';
import { MutableContext, Item, Area, Box } from 'ekkiog-editing';

import Context from './Context';
import Renderer from './Renderer';
import { VertexBuffer } from './textures/types';

export interface MutableContext extends MutableContext {
  updateDataTextures() : void;
}


export default class Engine {
  readonly context : Context;
  readonly moveContext : Context;
  private readonly renderer : Renderer;
  constructor(
    private readonly gl : WebGLRenderingContext
  ) {
    const atomicBind = makeAtomicBind();
    this.context = new Context(gl, atomicBind);
    this.moveContext = new Context(gl, atomicBind);
    this.renderer = new Renderer(gl);
  }

  setViewport(width : number, height : number){
    this.renderer.setViewport(width, height);
  }

  update(){
    this.renderer.renderMap(this.context);
  }

  updateMove(){
    this.renderer.renderMap(this.moveContext);
  }

  simulate(tickCount? : number){
    this.renderer.simulateTick(this.context, tickCount);
  }

  render(mapToViewportMatrix : mat3) {
    this.renderer.renderView(this.context, mapToViewportMatrix);
  }

  renderMove(mapToViewportMatrix : mat3, box : Box, dx : number, dy : number){
    this.renderer.renderMove(this.moveContext, mapToViewportMatrix, box, dx, dy);
  }
}

function makeAtomicBind(){
  let currentVBO : VertexBuffer | undefined = undefined;
  return (vbo : VertexBuffer) => {
    if(currentVBO === vbo) return;

    currentVBO = vbo;
    vbo.bind();
  };
}
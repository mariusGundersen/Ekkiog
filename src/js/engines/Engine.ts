import { mat3 } from 'gl-matrix';
import { Item, Area, Box } from 'ekkiog-editing';

import Context, { MutableContext } from './Context';
import Renderer from './Renderer';
import { VertexBuffer } from './textures/types';

export default class Engine {
  private readonly context : Context;
  private readonly moveContext : Context;
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

  mutateContext(mutator : (context : MutableContext) => void){
    const changed = this.context.mutateContext(mutator);
    if(changed){
      this.simulate();
      this.renderer.renderMap(this.context);
    }
  }

  mutateMoveContext(mutator : (context : MutableContext) => void){
    const changed = this.moveContext.mutateContext(mutator);
    if(changed){
      this.renderer.simulateTick(this.moveContext, 0);
      this.renderer.renderMap(this.moveContext);
    }
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
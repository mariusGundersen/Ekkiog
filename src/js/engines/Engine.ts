import { mat3 } from 'gl-matrix';
import { Box } from '../editing';

import Context, { MutableContext } from './Context';
import Renderer from './Renderer';
import { AtomicBind, Bindable } from './buffers/types';
import Viewport from './buffers/Viewport';

export default class Engine {
  private readonly context: Context;
  private readonly moveContext: Context;
  private readonly renderer: Renderer;
  private readonly viewport: Viewport;
  constructor(
    gl: WebGLRenderingContext,
    width: number,
    height: number
  ) {
    const vertexBind = makeAtomicBind();
    const outputBind = makeAtomicBind();
    this.context = new Context(gl, vertexBind, outputBind);
    this.moveContext = new Context(gl, vertexBind, outputBind);
    this.viewport = new Viewport(gl, outputBind, width, height);
    this.renderer = new Renderer(gl, this.viewport);
  }

  setViewport(width: number, height: number) {
    this.viewport.resize(width, height);
  }

  mutateContext(mutator: (context: MutableContext) => void) {
    const changed = this.context.mutateContext(mutator);
    if (changed) {
      this.simulate();
      this.renderer.renderMap(this.context);
    }
  }

  mutateMoveContext(mutator: (context: MutableContext) => void) {
    const changed = this.moveContext.mutateContext(mutator);
    if (changed) {
      this.renderer.renderChargeMap(this.moveContext, this.context);
      this.renderer.renderMap(this.moveContext);
    }
  }

  simulate(tickCount?: number) {
    this.renderer.simulateTick(this.context, tickCount);
    this.renderer.test(this.context);
  }

  render(mapToViewportMatrix: mat3) {
    this.renderer.renderView(this.context, mapToViewportMatrix);
  }

  renderMove(mapToViewportMatrix: mat3, box: Box, dx: number, dy: number) {
    this.renderer.renderMove(this.moveContext, mapToViewportMatrix, box, dx, dy);
  }
}

function makeAtomicBind(): AtomicBind {
  let currentBind: Bindable | undefined = undefined;
  return (bindable: Bindable) => () => {
    //if (currentBind === bindable) return;

    currentBind = bindable;
    bindable._bind();
  };
}
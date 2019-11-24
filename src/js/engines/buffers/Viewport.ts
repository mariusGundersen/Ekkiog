import { FrameBuffer, AtomicBind } from "./types";
import AbstractBindlable from "./Bindable";

export default class Viewport extends AbstractBindlable implements FrameBuffer {
  readonly gl: WebGLRenderingContext;
  width: number;
  height: number;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind, width: number, height: number) {
    super(atomicBind);
    this.gl = gl;
    this.width = width;
    this.height = height;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  clear(r = 0, g = 0, b = 0, a = 1) {
    this.bind();
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  _bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
  }
}
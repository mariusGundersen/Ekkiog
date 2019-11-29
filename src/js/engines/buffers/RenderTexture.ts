import Texture from './Texture';

import { FrameBuffer, AtomicBind } from './types';

export default class RenderTexture extends Texture implements FrameBuffer {
  private readonly frameBuffer: WebGLFramebuffer;
  private readonly renderBuffer: WebGLRenderbuffer;
  private readonly blend: boolean;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind, width: number, height = width, blend = false) {
    super(gl, width, height);
    this.bind = atomicBind(this);
    this.blend = blend;
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.gl.UNSIGNED_BYTE, null);

    this.frameBuffer = gl.createFramebuffer() || (() => { throw new Error("Could not make framebuffer") })();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.renderBuffer = this.gl.createRenderbuffer() || (() => { throw new Error("Could not make framebuffer") })();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderBuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
  }

  clear(r = 0, g = 0, b = 0, a = 1) {
    this.bind();
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  _bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    if (this.blend) {
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    } else {
      this.gl.disable(this.gl.BLEND);
    }
  }

  resize(width: number, height = width) {
    super.resize(width, height);
    this.bindTexture();
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderBuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
  }

  bind() { }
}
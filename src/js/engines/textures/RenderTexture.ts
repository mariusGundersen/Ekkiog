import ndarray from 'ndarray';
import Texture from './Texture';

import { FrameBuffer } from './types';

export default class RenderTexture extends Texture implements FrameBuffer{
  private readonly frameBuffer : WebGLFramebuffer;
  private readonly renderBuffer : WebGLRenderbuffer;
  constructor(gl : WebGLRenderingContext, size : number, type = gl.RGBA){
    super(gl, size);

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, type, size, size, 0, type, this.gl.UNSIGNED_BYTE, null);

    this.frameBuffer = gl.createFramebuffer() || (() => {throw new Error("Could not make framebuffer")})();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.renderBuffer = this.gl.createRenderbuffer() || (() => {throw new Error("Could not make framebuffer")})();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, size, size);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.renderBuffer);
  }

  bindFramebuffer(){
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.viewport(0, 0, this.width, this.height);
  }

  unbindFramebuffer(){
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
}
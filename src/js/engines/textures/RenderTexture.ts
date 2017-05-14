import ndarray from 'ndarray';
import Texture from './Texture';

import { FrameBuffer } from './types';

export default class RenderTexture extends Texture implements FrameBuffer{
  private readonly frameBuffer : WebGLFramebuffer;
  private readonly renderBuffer : WebGLRenderbuffer;
  constructor(gl : WebGLRenderingContext, width : number, height : number){
    super(gl, width, height);

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

    this.frameBuffer = gl.createFramebuffer() || (() => {throw new Error("Could not make framebuffer")})();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.renderBuffer = this.gl.createRenderbuffer() || (() => {throw new Error("Could not make framebuffer")})();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);
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
import {vec2} from 'gl-matrix';
import ndarray from 'ndarray';
import createShader from 'gl-shader';

import Quadrangle from '../Quadrangle.js';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

export default class ChargeMapEngine{
  constructor(gl, context) {
    this.gl = gl;
    this.quadrangle = new Quadrangle(gl);
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);

    this.width = context.width;
    this.height = context.height;

    this.netMapTexture = context.netMapTexture;
    this.netChargeTexture = context.netChargeTexture;

    this.frameBuffer = gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.chargeMapTexture = context.chargeMapTexture;

    const renderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.chargeMapTexture.texture, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderBuffer);
  }

  render(){
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.quadrangle.bindShader(this.shader);

    this.shader.uniforms.netMap = this.netMapTexture.sampler2D(0);
    this.shader.uniforms.netCharges = this.netChargeTexture.sampler2D(1);

    this.quadrangle.render();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }
}
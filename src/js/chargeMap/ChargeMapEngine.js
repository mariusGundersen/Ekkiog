import createShader from 'gl-shader';

import Quadrangle from '../Quadrangle.js';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

export default class ChargeMapEngine{
  constructor(gl, context) {
    this.gl = gl;
    this.quadrangle = new Quadrangle(gl);
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);

    this.netMapTexture = context.netMapTexture;
    this.netChargeTextures = context.netChargeTextures;
    this.renderTexture = context.chargeMapTexture;
  }

  render(tick){
    this.renderTexture.bindFramebuffer();

    this.quadrangle.bindShader(this.shader);

    this.shader.uniforms.netMap = this.netMapTexture.sampler2D(0);

    this.shader.uniforms.netCharges = this.netChargeTextures[tick%2].sampler2D(1);

    this.quadrangle.render();

    this.renderTexture.unbindFramebuffer();
  }
}
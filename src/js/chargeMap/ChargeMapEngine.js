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
    this.netChargeTexture = context.netChargeTexture;
    this.renderTexture = context.chargeMapTexture;
  }

  render(){
    this.renderTexture.bindFramebuffer();

    this.quadrangle.bindShader(this.shader);

    this.shader.uniforms.netMap = this.netMapTexture.sampler2D(0);
    this.shader.uniforms.netCharges = this.netChargeTexture.sampler2D(1);

    this.quadrangle.render();

    this.renderTexture.unbindFramebuffer();
  }
}
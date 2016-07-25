import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

export default class ChargeMapEngine{
  constructor(gl, context) {
    this.gl = gl;
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);

    this.netMapTexture = context.netMapTexture;
    this.netChargeTextures = context.netChargeTextures;
    this.renderTexture = context.chargeMapTexture;
  }

  render(tick){
    this.renderTexture.bindFramebuffer();

    this.shader.bind();

    this.shader.uniforms.netMap = this.netMapTexture.sampler2D(0);

    this.shader.uniforms.netCharges = this.netChargeTextures[tick%2].sampler2D(1);

    fillScreen(this.gl);

    this.renderTexture.unbindFramebuffer();
  }
}
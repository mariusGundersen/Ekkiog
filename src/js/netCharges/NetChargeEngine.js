import createShader from 'gl-shader';

import Quadrangle from '../Quadrangle.js';

import netChargesVS from './netChargesVS.glsl';
import netChargesFS from './netChargesFS.glsl';

export default class NetChargeEngine{
  constructor(gl, context) {
    this.gl = gl;
    this.quadrangle = new Quadrangle(gl);
    this.shader = createShader(gl, netChargesVS, netChargesFS);

    this.netChargeTextures = context.netChargeTextures;
    this.gatesTexture = context.gatesTexture;
  }

  render(tick){
    const inputTexture = this.netChargeTextures[(tick+1)%2];
    const outputTexture = this.netChargeTextures[tick%2];

    outputTexture.bindFramebuffer();

    this.quadrangle.bindShader(this.shader);

    this.shader.uniforms.gates = this.gatesTexture.sampler2D(0);

    this.shader.uniforms.netCharges = inputTexture.sampler2D(1);

    this.quadrangle.render();

    outputTexture.unbindFramebuffer();
  }
}
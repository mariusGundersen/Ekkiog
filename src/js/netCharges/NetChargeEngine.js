import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

import netChargesVS from './netChargesVS.glsl';
import netChargesFS from './netChargesFS.glsl';

export default class NetChargeEngine{
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, netChargesVS, netChargesFS);
  }

  render(context, tick){
    const inputTexture = context.netChargeTextures[(tick+1)%2];
    const outputTexture = context.netChargeTextures[tick%2];

    outputTexture.bindFramebuffer();

    this.shader.bind();

    this.shader.uniforms.gates = context.gatesTexture.sampler2D(0);

    this.shader.uniforms.netCharges = inputTexture.sampler2D(1);

    fillScreen(this.gl);

    outputTexture.unbindFramebuffer();
  }
}
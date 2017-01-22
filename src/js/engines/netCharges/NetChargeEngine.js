import createShader from 'gl-shader';

import * as triangle from '../triangle.js';

import netChargesVS from './netChargesVS.glsl';
import netChargesFS from './netChargesFS.glsl';

export default class NetChargeEngine{
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, netChargesVS, netChargesFS);
  }

  render(inputTexture, gatesTexture, outputTexture){
    outputTexture.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms.gates = gatesTexture.sampler2D(0);
    this.shader.uniforms.netCharges = inputTexture.sampler2D(1);

    triangle.draw();

    outputTexture.unbindFramebuffer();
  }
}
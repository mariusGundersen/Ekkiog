import createShader from 'gl-shader';

import * as triangle from '../triangle.js';

import chargeMapVS from './chargeMapVS.glsl';
import chargeMapFS from './chargeMapFS.glsl';

export default class ChargeMapEngine{
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, chargeMapVS, chargeMapFS);
  }

  render(input, charges, spriteSheet, output){
    if(!spriteSheet.ready) return;

    output.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms.inverseSpriteTextureSize = spriteSheet.inverseSize;

    this.shader.uniforms.spriteSheet = spriteSheet.sampler2D(0);
    this.shader.uniforms.netMap = input.sampler2D(1);
    this.shader.uniforms.netCharges = charges.sampler2D(2);

    triangle.draw();

    output.unbindFramebuffer();
  }
}
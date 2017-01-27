import createShader from 'gl-shader';

import * as triangle from '../triangle.js';

import tileMapVS from './tileMapVS.glsl';
import tileMapFS from './tileMapFS.glsl';

export default class TileMapEngine{
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, tileMapVS, tileMapFS);
  }

  render(input, output){
    output.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms.tilemap = input.sampler2D(0);
    this.shader.uniforms.inverseTileTextureSize = input.inverseSize;

    triangle.draw();

    output.unbindFramebuffer();
  }
}
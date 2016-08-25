import createShader from 'gl-shader';

import * as triangle from '../triangle.js';

import tileMapVS from './tileMapVS.glsl';
import tileMapFS from './tileMapFS.glsl';

export default class TileMapEngine{
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, tileMapVS, tileMapFS);
  }

  render(context){
    context.tileMapTexture.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms.tilemap = context.mapTexture.sampler2D(0);
    this.shader.uniforms.inverseTileTextureSize = context.mapTexture.inverseSize;

    triangle.draw();

    context.tileMapTexture.unbindFramebuffer();
  }
}
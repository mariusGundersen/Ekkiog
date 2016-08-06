import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

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

    this.shader.uniforms.tilemap = context.mapTexture.sampler2D(0);
    this.shader.uniforms.inverseTileTextureSize = context.mapTexture.inverseSize;

    fillScreen(this.gl);

    context.tileMapTexture.unbindFramebuffer();
  }
}
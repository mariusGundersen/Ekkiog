import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

import tileMapVS from './tileMapVS.glsl';
import tileMapFS from './tileMapFS.glsl';

export default class TileMapEngine{
  constructor(gl, context) {
    this.gl = gl;
    this.shader = createShader(gl, tileMapVS, tileMapFS);

    this.mapTexture = context.mapTexture;
    this.renderTexture = context.tileMapTexture;
  }

  render(){
    this.renderTexture.bindFramebuffer();

    this.shader.bind();

    this.shader.uniforms.tilemap = this.mapTexture.sampler2D(0);
    this.shader.uniforms.inverseTileTextureSize = this.mapTexture.inverseSize;

    fillScreen(this.gl);

    this.renderTexture.unbindFramebuffer();
  }
}
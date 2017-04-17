import createShader, {GlShader} from 'gl-shader';
import drawTriangle from 'a-big-triangle';

import tileMapVS from './tileMapVS.glsl';
import tileMapFS from './tileMapFS.glsl';

import RenderTexture from '../../textures/RenderTexture';
import DataTexture from '../../textures/DataTexture';

export default class TileMapEngine{
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, tileMapVS, tileMapFS);
  }

  render(input : DataTexture, output : RenderTexture){
    output.bindFramebuffer();

    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms['tilemap'] = input.sampler2D(0);
    this.shader.uniforms['inverseTileTextureSize'] = input.inverseSize;

    drawTriangle(this.gl)

    output.unbindFramebuffer();
  }
}
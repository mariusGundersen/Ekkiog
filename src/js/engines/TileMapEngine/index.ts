import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import tileMapVS from './tileMapVS.glsl';
import tileMapFS from './tileMapFS.glsl';

export default class TileMapEngine {
  gl: WebGLRenderingContext;
  shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, tileMapVS, tileMapFS);
  }

  render(vertexBuffer: VertexBuffer, input: TextureBuffer, output: FrameBuffer) {
    this.shader.bind();

    this.shader.uniforms['tilemap'] = input.sampler2D(0);
    this.shader.uniforms['inverseTileTextureSize'] = input.inverseSize;

    vertexBuffer.draw(output);
  }
}
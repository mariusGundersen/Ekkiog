import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import debugVS from './debugVS.glsl';
import debugFS from './debugFS.glsl';

export default class DebugEngine {
  gl: WebGLRenderingContext;
  shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, debugVS, debugFS);
  }

  render(vertexBuffer: VertexBuffer, texture: TextureBuffer, output: FrameBuffer, matrix: mat3) {
    this.shader.bind();

    this.shader.uniforms.matrix = matrix;
    this.shader.uniforms.texture = texture.sampler2D(0);

    vertexBuffer.draw(output);
  }
}
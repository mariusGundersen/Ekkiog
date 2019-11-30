import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import netChargesVS from './netChargesVS.glsl';
import netChargesFS from './netChargesFS.glsl';

export default class NetChargeEngine {
  gl: WebGLRenderingContext;
  shader: GlShader
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, netChargesVS, netChargesFS);
  }

  render(vertexBuffer: VertexBuffer, input: TextureBuffer, gates: TextureBuffer, output: FrameBuffer) {
    this.shader.bind();

    this.shader.uniforms['gates'] = gates.sampler2D(0);
    this.shader.uniforms['netCharges'] = input.sampler2D(1);

    vertexBuffer.draw(output);
  }
}
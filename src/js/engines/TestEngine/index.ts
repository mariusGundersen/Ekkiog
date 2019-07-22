import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../textures/types';

import testVS from './testVS.glsl';
import testFS from './testFS.glsl';

export default class TestEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, testVS, testFS);
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  render(vertexBuffer: VertexBuffer, chargeTexture: TextureBuffer, output: FrameBuffer, tick: number) {
    output.bindFramebuffer();

    this.shader.bind();

    const sample = tick % output.width;//0 - (output.width-1)
    const posX = sample / (output.width - 1);//0 - 1

    this.shader.uniforms['posX'] = posX;
    this.shader.uniforms['chargeTexture'] = chargeTexture.sampler2D(0);

    vertexBuffer.draw();

    output.unbindFramebuffer();
  }
}
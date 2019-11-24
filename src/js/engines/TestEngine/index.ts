import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import testVS from './testVS.glsl';
import testFS from './testFS.glsl';
import PointList from '../buffers/PointList';

export default class TestEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, testVS, testFS);
  }

  render(points: PointList, chargeTexture: TextureBuffer, exectedResultTexture: TextureBuffer, output: FrameBuffer, sample: number) {
    this.shader.bind();

    const posX = (sample + 0.5) / output.width;//0 - 1

    this.shader.uniforms['posX'] = posX;
    this.shader.uniforms['chargeTexture'] = chargeTexture.sampler2D(0);
    this.shader.uniforms['expectedResultTexture'] = exectedResultTexture.sampler2D(1);

    points.draw(output);
  }
}
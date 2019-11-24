import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import testVS from './testVS.glsl';
import testFS from './testFS.glsl';
import PointList from '../buffers/PointList';

export default class TestEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;
  private readonly size: vec2;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, testVS, testFS);
    this.size = vec2.create();
  }

  render(points: PointList, chargeTexture: TextureBuffer, exectedResultTexture: TextureBuffer, output: FrameBuffer, sample: number) {
    this.shader.bind();

    const posX = (sample + 0.5);//0 - 1
    vec2.set(this.size, output.width, output.height);

    this.shader.uniforms['posX'] = posX;
    this.shader.uniforms['size'] = this.size;
    this.shader.uniforms['chargeTexture'] = chargeTexture.sampler2D(0);
    this.shader.uniforms['expectedResultTexture'] = exectedResultTexture.sampler2D(1);

    points.draw(output);
  }
}
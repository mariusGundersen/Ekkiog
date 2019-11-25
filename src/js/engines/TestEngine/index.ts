import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import testVS from './testVS.glsl';
import testFS from './testFS.glsl';
import PointList from '../buffers/PointList';

export default class TestEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;
  private readonly inverseSize: vec2;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, testVS, testFS);
    this.inverseSize = vec2.create();
  }

  render(points: PointList, chargeMapTexture: TextureBuffer, exectedResultTexture: TextureBuffer, output: FrameBuffer, sample: number) {
    this.shader.bind();

    const posX = (sample + 0.5);//0 - 1
    vec2.set(this.inverseSize, 1 / output.width, 1 / output.height);

    this.shader.uniforms['posX'] = posX;
    this.shader.uniforms['inverseSize'] = this.inverseSize;
    this.shader.uniforms['chargeMapTexture'] = chargeMapTexture.sampler2D(0);
    this.shader.uniforms['inverseChargeMapTextureSize'] = chargeMapTexture.inverseSize;
    this.shader.uniforms['expectedResultTexture'] = exectedResultTexture.sampler2D(1);

    points.draw(output);
  }
}
import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import buttonVS from './buttonVS.glsl';
import buttonFS from './buttonFS.glsl';
import PointList from '../buffers/PointList';

export default class ButtonEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;
  private readonly inverseSize: vec2;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, buttonVS, buttonFS);
    this.inverseSize = vec2.create();
  }

  render(points: PointList, netMapTexture: TextureBuffer, buttonInputTexture: TextureBuffer, output: FrameBuffer, sample: number) {
    this.shader.bind();

    const posX = (sample + 0.5);//0 - 1
    vec2.set(this.inverseSize, 1 / output.width, 1 / output.height);

    this.shader.uniforms['posX'] = posX;
    this.shader.uniforms['inverseSize'] = this.inverseSize;
    this.shader.uniforms['netMapTexture'] = netMapTexture.sampler2D(0);
    this.shader.uniforms['inverseNetMapTextureSize'] = netMapTexture.inverseSize;
    this.shader.uniforms['buttonInputTexture'] = buttonInputTexture.sampler2D(1);
    this.shader.uniforms['inverseButtonInputTextureSize'] = buttonInputTexture.inverseSize;

    points.draw(output);
  }
}
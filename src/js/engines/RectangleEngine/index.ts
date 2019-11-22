import { vec2, mat3 } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../textures/types';

import testVS from './testVS.glsl';
import testFS from './testFS.glsl';
import Rectangle from '../textures/Rectangle';

export default class RectangleEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, testVS, testFS);
  }

  render(rectangle: Rectangle, texture: TextureBuffer) {
    this.shader.bind();

    this.shader.uniforms['texture'] = texture.sampler2D(0);

    this.shader.uniforms['bottom'] = 0.0;
    this.shader.uniforms['height'] = 0.25;

    rectangle.draw();
  }
}
import { vec2, mat3, mat2d } from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import { VertexBuffer, TextureBuffer, FrameBuffer } from '../buffers/types';

import rectangleVS from './rectangleVS.glsl';
import rectangleFS from './rectangleFS.glsl';
import Rectangle from '../buffers/Rectangle';

export default class RectangleEngine {
  private readonly gl: WebGLRenderingContext;
  private readonly shader: GlShader;

  private readonly matrix: mat3;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, rectangleVS, rectangleFS);
    this.matrix = mat3.create();
  }

  render(rectangle: Rectangle, texture: TextureBuffer, output: FrameBuffer, screenHeight: number) {
    this.shader.bind();

    this.shader.uniforms['texture'] = texture.sampler2D(0);

    mat3.identity(this.matrix);
    mat3.translate(this.matrix, this.matrix, [0, 64 / screenHeight]);
    mat3.scale(this.matrix, this.matrix, [1, 64 / screenHeight]);

    this.shader.uniforms['matrix'] = this.matrix;

    rectangle.draw(output);
  }
}
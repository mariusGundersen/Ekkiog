import {vec2, mat3} from 'gl-matrix';
import createShader, { GlShader } from 'gl-shader';

import drawTriangle from 'a-big-triangle';

import debugVS from './debugVS.glsl';
import debugFS from './debugFS.glsl';

import Texture from '../../textures/Texture';

export default class DebugEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, debugVS, debugFS);
  }

  render(texture : Texture, matrix : mat3) {
    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms.matrix = matrix;
    this.shader.uniforms.texture = texture.sampler2D(0);

    drawTriangle(this.gl);
  }
}
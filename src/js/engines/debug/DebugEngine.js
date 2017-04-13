import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';

import * as triangle from '../triangle.js';

import debugVS from './debugVS.glsl';
import debugFS from './debugFS.glsl';

export default class DebugEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, debugVS, debugFS);
  }

  render(texture, matrix) {
    this.shader.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.shader.uniforms.matrix = matrix;
    this.shader.uniforms.texture = texture.sampler2D(0);

    triangle.draw();
  }
}
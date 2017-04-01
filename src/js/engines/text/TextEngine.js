import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';
import createVAO from 'gl-vao';
import createBuffer from 'gl-buffer';

import textVS from './textVS.glsl';
import textFS from './textFS.glsl';

export default class TextEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, textVS, textFS);
    this.vao = createVAO(gl, [{
      buffer: createBuffer(gl, [
         64.0, 64.0, 0.0, 0.0,
         65.0, 64.0, 1.0, 0.0,
         64.0, 65.0, 0.0, 1.0,

         64.0, 65.0, 0.0, 1.0,
         65.0, 64.0, 1.0, 0.0,
         65.0, 65.0, 1.0, 1.0
      ])
    }]);
  }

  render(context, matrix) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms.inverseMapTextureSize = context.tileMapTexture.inverseSize;
    this.shader.uniforms.inverseTileSize = 1/context.tileSize;
    this.shader.uniforms.matrix = matrix;

    this.vao.bind();
    this.vao.draw(this.gl.TRIANGLES, 6);
  }
}
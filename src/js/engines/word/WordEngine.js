import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';
import createVAO from 'gl-vao';
import createBuffer from 'gl-buffer';

import wordVS from './wordVS.glsl';
import wordFS from './wordFS.glsl';

export default class WordEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, wordVS, wordFS);
  }

  render(context) {
    if(!context.spriteSheetTexture.ready) return;

    context.wordTexture.bindFramebuffer();

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms.inverseWordTextureSize = context.wordTexture.inverseSize;

    this.shader.uniforms.spriteSheet = context.spriteSheetTexture.sampler2D(0);

    context.wordQuadList.draw();
    context.wordTexture.unbindFramebuffer();
  }
}
import createShader from 'gl-shader';

import textVS from './textVS.glsl';
import textFS from './textFS.glsl';

export default class TextEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, textVS, textFS);
  }

  render(context, matrix) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms.inverseMapTextureSize = context.tileMapTexture.inverseSize;
    this.shader.uniforms.tileSize = context.tileSize;
    this.shader.uniforms.matrix = matrix;

    this.shader.uniforms.spriteSheet = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms.chargeMap = context.chargeMapTexture.sampler2D(1);

    context.wordQuadList.draw();
  }
}

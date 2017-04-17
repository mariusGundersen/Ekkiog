import createShader, { GlShader } from 'gl-shader';
import { mat3 } from 'gl-matrix';

import textVS from './textVS.glsl';
import textFS from './textFS.glsl';

import Context from '../../Context';

export default class TextEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, textVS, textFS);
  }

  render(context : Context, matrix : mat3) {
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

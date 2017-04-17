import createShader, { GlShader } from 'gl-shader';
import { mat3 } from 'gl-matrix';

import textVS from './textVS.glsl';
import textFS from './textFS.glsl';

import { RenderContext } from '../../textures/types';

export default class TextEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, textVS, textFS);
  }

  render(context : RenderContext, matrix : mat3) {
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

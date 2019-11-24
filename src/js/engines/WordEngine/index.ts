import createShader, { GlShader } from 'gl-shader';
import { mat3 } from 'gl-matrix';

import wordVS from './wordVS.glsl';
import wordFS from './wordFS.glsl';

import Context from '../Context';
import { FrameBuffer } from '../buffers/types';

export default class WordEngine {
  gl: WebGLRenderingContext;
  shader: GlShader;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, wordVS, wordFS);
  }

  render(context: Context, output: FrameBuffer, matrix: mat3) {
    this.shader.bind();

    this.shader.uniforms['inverseSpriteTextureSize'] = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms['inverseMapTextureSize'] = context.mapTexture.inverseSize;
    this.shader.uniforms['tileSize'] = context.tileSize;
    this.shader.uniforms['matrix'] = matrix;

    this.shader.uniforms['spriteSheet'] = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms['chargeMap'] = context.chargeMapTexture.sampler2D(1);

    context.wordQuads.draw(output);
  }
}

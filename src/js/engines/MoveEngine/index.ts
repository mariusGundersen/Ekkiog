import {vec2, mat3} from 'gl-matrix';
import createShader, {GlShader} from 'gl-shader';

import { RenderContext } from '../textures/types';

import moveVS from './moveVS.glsl';
import moveFS from './moveFS.glsl';

export default class MoveEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, moveVS, moveFS);
  }

  render(context : RenderContext, matrix : mat3, [top, left, right, bottom] : number[]) {
    this.shader.bind();

    this.shader.uniforms['spriteTextureSize'] = context.spriteSheetTexture.size;
    this.shader.uniforms['inverseSpriteTextureSize'] = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms['mapTextureSize'] = context.tileMapTexture.size;
    this.shader.uniforms['tileSize'] = context.tileSize;
    this.shader.uniforms['matrix'] = matrix;

    this.shader.uniforms['spriteSheet'] = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms['chargeMap'] = context.chargeMapTexture.sampler2D(1);
    this.shader.uniforms['tileMap'] = context.tileMapTexture.sampler2D(2);

    this.shader.uniforms['boundingBox'] = [
      top-1,
      left-1,
      right,
      bottom
    ];

    context.triangle.draw();
  }
}
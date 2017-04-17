import {vec2, mat3} from 'gl-matrix';
import createShader, {GlShader} from 'gl-shader';

import drawTriangle from 'a-big-triangle';

import moveVS from './moveVS.glsl';
import moveFS from './moveFS.glsl';

import Context from '../../Context';

export default class MoveEngine {
  gl : WebGLRenderingContext;
  shader : GlShader;
  constructor(gl : WebGLRenderingContext) {
    this.gl = gl;
    this.shader = createShader(gl, moveVS, moveFS);
  }

  render(context : Context, matrix : mat3, [top, left, right, bottom] : number[], dx : number, dy : number) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms['inverseSpriteTextureSize'] = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms['mapTextureSize'] = context.tileMapTexture.size;
    this.shader.uniforms['tileSize'] = context.tileSize;
    this.shader.uniforms['matrix'] = matrix;

    this.shader.uniforms['spriteSheet'] = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms['chargeMap'] = context.chargeMapTexture.sampler2D(1);
    this.shader.uniforms['tileMap'] = context.tileMapTexture.sampler2D(2);

    this.shader.uniforms['boundingBox'] = [
      top-3,
      left-2,
      right-1,
      bottom-2
    ];
    this.shader.uniforms['translate'] = [dx, dy];

    drawTriangle(this.gl)
  }
}
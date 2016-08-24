import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';

import * as triangle from '../triangle.js';

import moveVS from './moveVS.glsl';
import moveFS from './moveFS.glsl';

export default class MoveEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, moveVS, moveFS);
  }

  render(context, matrix, [top, left, right, bottom], dx, dy) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms.mapTextureSize = context.tileMapTexture.size;
    this.shader.uniforms.tileSize = context.tileSize;
    this.shader.uniforms.matrix = matrix;

    this.shader.uniforms.spriteSheet = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms.chargeMap = context.chargeMapTexture.sampler2D(1);
    this.shader.uniforms.tileMap = context.tileMapTexture.sampler2D(2);

    this.shader.uniforms.boundingBox = [
      top-1,
      left-1,
      right+1,
      bottom+1
    ];
    this.shader.uniforms.translate = [dx, dy];

    triangle.draw();
  }
}
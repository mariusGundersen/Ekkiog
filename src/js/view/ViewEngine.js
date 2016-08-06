import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

import tilemapVS from './viewVS.glsl';
import tilemapFS from './viewFS.glsl';

export default class ViewEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, tilemapVS, tilemapFS);
  }

  render(context, matrix) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms.mapTextureSize = context.tileMapTexture.size;
    this.shader.uniforms.tileSize = context.tileSize;
    this.shader.uniforms.matrix = matrix;

    this.shader.uniforms.spriteSheet = context.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms.chargeMap = context.chargeMapTexture.sampler2D(1);
    this.shader.uniforms.tileMap = context.tileMapTexture.sampler2D(2);

    fillScreen(this.gl);
  }
}
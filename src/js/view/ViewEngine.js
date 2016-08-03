import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';
import fillScreen from 'a-big-triangle';

import tilemapVS from './viewVS.glsl';
import tilemapFS from './viewFS.glsl';

export default class ViewEngine {
  constructor(gl, context, matrix) {
    this.gl = gl;
    this.context = context;
    this.matrix = matrix;

    this.spriteSheetTexture = context.spriteSheetTexture;
    this.tileMapTexture = context.tileMapTexture;
    this.chargeMapTexture = context.chargeMapTexture;

    this.shader = createShader(gl, tilemapVS, tilemapFS);
  }

  render() {
    if(!this.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = this.spriteSheetTexture.inverseSize;
    this.shader.uniforms.mapTextureSize = this.tileMapTexture.size;
    this.shader.uniforms.tileSize = this.context.tileSize;
    this.shader.uniforms.matrix = this.matrix;

    this.shader.uniforms.spriteSheet = this.spriteSheetTexture.sampler2D(0);
    this.shader.uniforms.chargeMap = this.chargeMapTexture.sampler2D(1);
    this.shader.uniforms.tileMap = this.tileMapTexture.sampler2D(2);

    fillScreen(this.gl);
  }
}
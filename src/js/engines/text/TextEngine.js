import {vec2, mat3} from 'gl-matrix';
import createShader from 'gl-shader';
import createVAO from 'gl-vao';
import createBuffer from 'gl-buffer';

import textVS from './textVS.glsl';
import textFS from './textFS.glsl';

export default class TextEngine {
  constructor(gl) {
    this.gl = gl;
    this.shader = createShader(gl, textVS, textFS);
    this.texts = [{
      x: 65,
      y: 64,
      w: 5,
      h: 7
    },
    {
      x: 66,
      y: 63,
      w: 9,
      h: 7
    },
    {
      x: 66,
      y: 65,
      w: 9,
      h: 7
    }];
    const verts = [...toQuads(...this.texts)];
    this.vao = createVAO(gl, [{
      buffer: createBuffer(gl, verts)
    }]);
  }

  render(context, matrix) {
    if(!context.spriteSheetTexture.ready) return;

    this.shader.bind();

    this.shader.uniforms.inverseSpriteTextureSize = context.spriteSheetTexture.inverseSize;
    this.shader.uniforms.inverseMapTextureSize = context.tileMapTexture.inverseSize;
    this.shader.uniforms.tileSize = context.tileSize;
    this.shader.uniforms.matrix = matrix;

    this.shader.uniforms.spriteSheet = context.spriteSheetTexture.sampler2D(0);

    this.vao.bind();
    this.vao.draw(this.gl.TRIANGLES, this.texts.length * 6);
  }
}

function* toQuads(...positions){
  for(const {x, y, w, h} of positions){
    yield x;
    yield y;
    yield 0;
    yield 0;

    yield x + w/16;
    yield y;
    yield w;
    yield 0;

    yield x;
    yield y + h/16;
    yield 0;
    yield h;

    yield x;
    yield y + h/16;
    yield 0;
    yield h;

    yield x + w/16;
    yield y;
    yield w;
    yield 0;

    yield x + w/16;
    yield y + h/16;
    yield w;
    yield h;
  }
}
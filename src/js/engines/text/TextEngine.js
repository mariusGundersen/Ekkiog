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
      y: 52,
      w: 16,
      h: 8,
      direction: 'rightward'
    },
    {
      x: 63,
      y: 53,
      w: 32,
      h: 8,
      direction: 'leftward'
    },
    {
      x: 63,
      y: 51,
      w: 64,
      h: 8,
      direction: 'leftward'
    },
    {
      x: 62,
      y: 53,
      w: 32,
      h: 8,
      direction: 'rightward'
    },
    {
      x: 62,
      y: 51,
      w: 64,
      h: 8,
      direction: 'rightward'
    },
    {
      x: 64,
      y: 39,
      w: 64,
      h: 8,
      direction: 'downward'
    },
    {
      x: 64,
      y: 40,
      w: 16,
      h: 8,
      direction: 'upward'
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
    this.shader.uniforms.chargeMap = context.chargeMapTexture.sampler2D(1);

    this.vao.bind();
    this.vao.draw(this.gl.TRIANGLES, this.texts.length * 6);
  }
}

function* toQuads(...positions){
  for(const {x, y, w, h, direction} of positions){
    const scaleW = 16/w;
    const scale = scaleW > 0.5
      ? 1/2/16
      : scaleW/16;

    const tx = x + 1/2 + w*scale*(
      direction === 'leftward'
      ? -1
      : direction === 'rightward'
      ? 0
      : -1/2
    );
    const ty = y+(
      direction === 'rightward'
      ? 7/16-h*scale
      : direction === 'leftward'
      ? 9/16
      : direction === 'downward'
      ? 11/16
      : 7/16-h*scale
    );
    yield* interleave(
      quad(tx, ty, w*scale, h*scale),
      quad(0, 0, w, h)
    );
  }
}

function* quad(x, y, w, h){
    yield x;
    yield y;

    yield x + w;
    yield y;

    yield x;
    yield y + h;

    yield x;
    yield y + h;

    yield x + w;
    yield y;

    yield x + w;
    yield y + h;
}

function* interleave(a, b){
  while(true){
    let next = a.next();
    if(next.done) break;
    yield next.value;
    yield a.next().value;

    yield b.next().value;
    yield b.next().value;
  }
}
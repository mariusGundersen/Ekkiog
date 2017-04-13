precision mediump float;

attribute vec4 position;
uniform vec2 inverseWordTextureSize;
uniform vec2 inverseSpriteTextureSize;

varying vec2 uv;

void main(void) {
  vec2 pos = position.xy * inverseWordTextureSize;

  uv = position.zw * inverseSpriteTextureSize;
  gl_Position = vec4(pos*2.0 - 1.0, 0.0, 1.0);
}
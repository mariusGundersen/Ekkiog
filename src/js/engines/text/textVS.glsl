precision mediump float;

attribute vec4 position;
uniform mat3 matrix;
uniform vec2 inverseMapTextureSize;
uniform float inverseTileSize;
varying vec2 uv;

void main(void) {
  vec2 clipSpace = (matrix * vec3(position.xy * inverseMapTextureSize * 2.0 - 1.0, 1)).xy * vec2(1, -1);
  uv = position.zw;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
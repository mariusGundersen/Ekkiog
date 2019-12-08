precision highp float;

attribute vec4 position;
uniform mat3 matrix;
uniform vec2 inverseMapTextureSize;
uniform float inverseTileSize;

varying vec2 uv;
varying vec2 texCoord;

void main(void) {
  vec2 pos = position.xy * inverseMapTextureSize * 2.0 - 1.0;
  vec2 clipSpace = (matrix * vec3(pos, 1)).xy;
  texCoord = 0.5*(pos+1.0);
  uv = position.zw;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
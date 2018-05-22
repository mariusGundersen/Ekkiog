precision highp float;

attribute vec2 position;
uniform mat3 matrix;
uniform vec2 mapTextureSize;
uniform float tileSize;

varying vec2 pixelCoord;
varying vec2 texCoord;

void main(void) {
  vec2 clipSpace = (matrix * vec3(position, 1)).xy;
  texCoord = 0.5*(position+1.0);
  pixelCoord = texCoord * mapTextureSize * tileSize;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
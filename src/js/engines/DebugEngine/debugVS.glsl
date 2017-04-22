precision mediump float;

attribute vec2 position;
uniform mat3 matrix;

varying vec2 texCoord;

void main(void) {
  vec2 clipSpace = (matrix * vec3(position, 1)).xy;
  texCoord = 0.5*(position+1.0);
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
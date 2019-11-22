precision highp float;

attribute vec4 position;

uniform mat3 matrix;

varying vec2 texCoord;

void main(void) {
  texCoord = position.xy;

  vec3 pos = matrix*vec3(position.xy, 1);
  gl_Position = vec4(pos*2.0 - 1.0, 1.0);
}

precision mediump float;

attribute vec2 position;
attribute vec2 texture;
varying vec2 texCoord;

void main(void) {
  texCoord = texture;
  gl_Position = vec4(position * vec2(1, -1), 0.0, 1.0);
}

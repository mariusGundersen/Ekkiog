precision mediump float;

attribute vec2 position;
attribute vec2 texture;
varying vec2 mapCoord;

void main(void) {
  mapCoord = texture;
  gl_Position = vec4(position * vec2(1, -1), 0.0, 1.0);
}

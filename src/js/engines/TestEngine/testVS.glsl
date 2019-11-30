precision highp float;

attribute vec4 position;
uniform float posX;
uniform vec2 inverseSize;

varying vec2 gatePos;
varying vec2 pos;

void main(void) {
  gatePos = position.zw;
  pos = vec2(posX, position.y)*inverseSize;

  gl_Position = vec4(pos*2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}

precision highp float;

attribute vec4 position;
uniform float posX;
uniform vec2 size;

varying vec2 gateAddress;
varying vec2 pos;

void main(void) {
  gateAddress = position.zw;
  pos = vec2(posX, position.y)/size;

  gl_Position = vec4(pos*2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}

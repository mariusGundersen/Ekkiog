precision highp float;

attribute vec4 position;
uniform float posX;

varying vec2 gateAddress;
varying float posY;

void main(void) {
  vec2 pos = vec2(posX, position.y)*2.0 - 1.0;
  gateAddress = position.zw;
  posY = position.y;
  gl_Position = vec4(pos, 0.0, 1.0);
}

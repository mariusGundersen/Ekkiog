precision highp float;

attribute vec4 position;
uniform float posX;

varying vec2 gateAddress;

void main(void) {
  vec2 pos = vec2(posX, position.y)*2.0 - 1.0;
  gateAddress = position.zw;
  gl_Position = vec4(pos, 0.0, 1.0);
}

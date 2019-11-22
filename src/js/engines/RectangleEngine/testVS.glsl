precision highp float;

attribute vec4 position;
uniform float bottom;
uniform float height;

varying vec2 pos;

void main(void) {
  pos = position.zw;
  gl_Position = vec4(position.x, (position.y+1.0)*height - bottom*0.5-1.0, 0.0, 1.0);
}

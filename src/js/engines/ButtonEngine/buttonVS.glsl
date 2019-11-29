precision highp float;

attribute vec4 position;
uniform vec2 inverseButtonInputTextureSize;

uniform float posX;
uniform vec2 inverseSize;

uniform sampler2D netMapTexture;
uniform vec2 inverseNetMapTextureSize;

varying vec2 buttonInputPos;
varying vec2 pos;

void main(void) {
  buttonInputPos = vec2(posX, position.y)*inverseButtonInputTextureSize;
  
  //vec4 net = texture2D(netMapTexture, position.zw*inverseNetMapTextureSize);
  pos = position.zw*inverseSize;

  gl_Position = vec4(pos*2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}

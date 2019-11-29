precision highp float;

attribute vec4 position;
uniform vec2 inverseButtonInputTextureSize;

uniform float posX;
uniform vec2 inverseSize;

uniform sampler2D netMapTexture;
uniform vec2 inverseNetMapTextureSize;

varying vec2 buttonInputPos;

void main(void) {
  buttonInputPos = vec2(posX, position.y)*inverseButtonInputTextureSize;
  
  vec4 netPos = texture2D(netMapTexture, position.zw*inverseNetMapTextureSize);
  vec2 pos = netPos.xy + 0.5*inverseSize;

  gl_Position = vec4(pos*2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}

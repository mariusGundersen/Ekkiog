precision highp float;

uniform sampler2D chargeMapTexture;
uniform sampler2D expectedResultTexture;
uniform vec2 inverseChargeMapTextureSize;

varying vec2 pos;
varying vec2 gatePos;

void main(void) {
  float expectedResult = texture2D(expectedResultTexture, pos).r;
  float actualResult = texture2D(chargeMapTexture, gatePos*inverseChargeMapTextureSize).a;
  float success = abs(expectedResult - actualResult) < 0.6 ? 1.0 : 0.0;
  gl_FragColor = vec4(0.7 - success*0.7, success*0.6, 0.0, 1.0);
}

precision highp float;

uniform sampler2D chargeTexture;
uniform sampler2D expectedResultTexture;

varying vec2 pos;
varying vec2 gateAddress;

void main(void) {
  float expectedResult = texture2D(expectedResultTexture, pos).r;
  float actualResult = texture2D(chargeTexture, gateAddress/256.0).r;
  float success = abs(expectedResult - actualResult) < 0.6 ? 1.0 : 0.0;
  gl_FragColor = vec4(1.0 - success, success*0.7, 0.0, 0.5);
}

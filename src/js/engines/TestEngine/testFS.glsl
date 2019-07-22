precision highp float;

uniform sampler2D chargeTexture;

varying vec2 gateAddress;

void main(void) {
  gl_FragColor = vec4(0.0, texture2D(chargeTexture, gateAddress/256.0).x, 0.0, 1.0);
}

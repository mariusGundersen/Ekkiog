precision highp float;

uniform sampler2D buttonInputTexture;

varying vec2 pos;
varying vec2 buttonInputPos;

void main(void) {
  float charge = texture2D(buttonInputTexture, buttonInputPos).r;
  gl_FragColor = vec4(charge > 0.5 ? 1.0 : 0.0);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}

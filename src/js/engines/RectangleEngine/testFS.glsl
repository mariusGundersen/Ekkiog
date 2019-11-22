precision highp float;

uniform sampler2D texture;

varying vec2 pos;

void main(void) {
  // gl_FragColor = texture2D(texture, pos);
  gl_FragColor = vec4(texture2D(texture, pos).rg, 0.0, 1.0);
}

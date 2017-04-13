precision mediump float;

uniform sampler2D spriteSheet;

varying vec2 uv;

void main(void) {
  //gl_FragColor = vec4(uv, 0.0, 1.0);
  gl_FragColor = texture2D(spriteSheet, uv);
}

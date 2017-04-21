precision mediump float;

varying vec2 texCoord;
uniform sampler2D texture;

void main(void) {
  if(texCoord.x > 1.0 || texCoord.y > 1.0){
    discard;
  }

  gl_FragColor = texture2D(texture, texCoord);
}

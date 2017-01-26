precision mediump float;

varying vec2 pixelCoord;
varying vec2 texCoord;
uniform vec4 boundingBox;
uniform sampler2D tileMap;
uniform sampler2D spriteSheet;
uniform sampler2D chargeMap;
uniform vec2 inverseSpriteTextureSize;
uniform vec2 mapTextureSize;
uniform vec2 translate;
uniform float tileSize;

void main(void) {
  if(texCoord.x > 1.0 || texCoord.y > 1.0){
    discard;
  }

  vec2 movedCoord = texCoord - translate/mapTextureSize;
  vec2 tilePos = floor(movedCoord * mapTextureSize);

  if(tilePos.y <= boundingBox.x
  || tilePos.x <= boundingBox.y
  || tilePos.y >= boundingBox.w
  || tilePos.x >= boundingBox.z){
    discard;
  }

  vec4 tile = texture2D(tileMap, movedCoord);
  vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;
  vec2 spriteCoord = mod(pixelCoord, tileSize);
  vec4 color = texture2D(spriteSheet, (spriteOffset + spriteCoord) * inverseSpriteTextureSize);

  if(color.r == 1.0 && color.g == 0.0 && color.b == 1.0){
    vec4 charge = texture2D(chargeMap, movedCoord);
    gl_FragColor = charge * vec4(1.0, 1.0, 1.0, 0.9);
  }else{
    gl_FragColor = color * vec4(1.0, 1.0, 1.0, 0.9);
  }
}

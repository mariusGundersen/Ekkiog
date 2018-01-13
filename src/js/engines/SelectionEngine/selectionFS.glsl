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
  vec2 spriteOffset;

  if(tilePos.y < boundingBox.x
  || tilePos.x < boundingBox.y
  || tilePos.y > boundingBox.w
  || tilePos.x > boundingBox.z){
    spriteOffset = vec2(6.0, 9.0) * tileSize;
  }else if(tilePos.y == boundingBox.x
        && tilePos.x == boundingBox.y){
    spriteOffset = vec2(5.0, 8.0) * tileSize;
  }else if(tilePos.y == boundingBox.w
        && tilePos.x == boundingBox.z){
    spriteOffset = vec2(7.0, 10.0) * tileSize;
  }else if(tilePos.y == boundingBox.w
        && tilePos.x == boundingBox.y){
    spriteOffset = vec2(5.0, 10.0) * tileSize;
  }else if(tilePos.y == boundingBox.x
        && tilePos.x == boundingBox.z){
    spriteOffset = vec2(7.0, 8.0) * tileSize;
  }else if(tilePos.y == boundingBox.x){
    spriteOffset = vec2(6.0, 8.0) * tileSize;
  }else if(tilePos.x == boundingBox.y){
    spriteOffset = vec2(5.0, 9.0) * tileSize;
  }else if(tilePos.x == boundingBox.z){
    spriteOffset = vec2(7.0, 9.0) * tileSize;
  }else if(tilePos.y == boundingBox.w){
    spriteOffset = vec2(6.0, 10.0) * tileSize;
  }else{
    vec4 tile = texture2D(tileMap, movedCoord);
    spriteOffset = floor(tile.xy * 256.0) * tileSize;
  }

  vec2 spriteCoord = mod(pixelCoord, tileSize);

  vec4 color = texture2D(spriteSheet, (spriteOffset + spriteCoord) * inverseSpriteTextureSize);

  if(color.r == 1.0 && color.g <= 2.0/255.0 && color.b == 1.0 && color.a >= 253.0/255.0){
    vec4 charge = texture2D(chargeMap, tileCoord + color.ga - vec2(1.0/255.0, 254.0/255.0));
    gl_FragColor = charge;
  }else{
    gl_FragColor = color;
  }
}

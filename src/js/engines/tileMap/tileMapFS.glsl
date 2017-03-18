precision mediump float;

const vec2 WIRE = vec2(1.0, 0.0);
const vec2 UNDERPASS = vec2(2.0, 0.0);
const vec2 GATE_INPUT_A = vec2(9.0, 4.0);
const vec2 GATE_INPUT_B = vec2(9.0, 6.0);
const vec2 GATE_OUTPUT = vec2(12.0, 5.0);
const vec2 BUTTON_OUTPUT = vec2(11.0, 1.0);
const vec2 COMPONENT_TOP = vec2(3.0, 8.0);
const vec2 COMPONENT_LEFT = vec2(1.0, 9.0);
const vec2 COMPONENT_RIGHT = vec2(4.0, 10.0);
const vec2 COMPONENT_BOTTOM = vec2(2.0, 11.0);
const vec2 SOURCE_TOP = vec2(12.0, 3.0);
const vec2 SOURCE_LEFT = vec2(11.0, 3.0);
const vec2 SOURCE_RIGHT = vec2(9.0, 3.0);
const vec2 SOURCE_BOTTOM = vec2(10.0, 3.0);
const vec2 DRAIN_TOP = vec2(12.0, 7.0);
const vec2 DRAIN_LEFT = vec2(11.0, 7.0);
const vec2 DRAIN_RIGHT = vec2(9.0, 7.0);
const vec2 DRAIN_BOTTOM = vec2(10.0, 7.0);

uniform sampler2D tilemap;
uniform vec2 inverseTileTextureSize;
varying vec2 texCoord;

vec2 lookup(float x, float y);

void main() {
  vec2 value = lookup(0.0, 0.0);

  if(value == WIRE){
    vec2 tileUp    = lookup( 0.0, -1.0);
    vec2 tileDown  = lookup( 0.0,  1.0);
    vec2 tileLeft  = lookup(-1.0,  0.0);
    vec2 tileRight = lookup( 1.0,  0.0);

    float up = float(tileUp == WIRE
                  || tileUp == COMPONENT_BOTTOM
                  || tileUp == SOURCE_BOTTOM
                  || tileUp == DRAIN_BOTTOM)
             + float(tileUp == UNDERPASS)*4.0;
    float down = float(tileDown == WIRE
                    || tileDown == COMPONENT_TOP
                    || tileDown == SOURCE_TOP
                    || tileDown == DRAIN_TOP)
             + float(tileDown == UNDERPASS)*4.0;
    float left = float(tileLeft == WIRE
                    || tileLeft == UNDERPASS
                    || tileLeft == GATE_OUTPUT
                    || tileLeft == BUTTON_OUTPUT
                    || tileLeft == COMPONENT_RIGHT
                    || tileLeft == SOURCE_RIGHT
                    || tileLeft == DRAIN_RIGHT);
    float right = float(tileRight == WIRE
                    || tileRight == UNDERPASS
                    || tileRight == GATE_INPUT_A
                    || tileRight == GATE_INPUT_B
                    || tileRight == COMPONENT_LEFT
                    || tileRight == SOURCE_LEFT
                    || tileRight == DRAIN_LEFT);

    vec2 tile = WIRE + vec2(
      up + right*2.0,
      down + left*2.0);

    gl_FragColor = vec4(tile/255.0, 0.0, 1.0);
  }else if(value == UNDERPASS){
    vec2 tileUp    = lookup( 0.0, -1.0);
    vec2 tileDown  = lookup( 0.0,  1.0);
    vec2 tileLeft  = lookup(-1.0,  0.0);
    vec2 tileRight = lookup( 1.0,  0.0);

    float up = float(tileUp == WIRE
                  || tileUp == UNDERPASS)*5.0;
    float down = float(tileDown == WIRE
                    || tileDown == UNDERPASS)*5.0;
    float left = float(tileLeft == WIRE
                    || tileLeft == UNDERPASS
                    || tileLeft == GATE_OUTPUT
                    || tileLeft == BUTTON_OUTPUT
                    || tileLeft == COMPONENT_RIGHT);
    float right = float(tileRight == WIRE
                    || tileRight == UNDERPASS
                    || tileRight == GATE_INPUT_A
                    || tileRight == GATE_INPUT_B
                    || tileRight == COMPONENT_LEFT);

    vec2 tile = WIRE + vec2(
      up + right*2.0,
      down + left*2.0);

    gl_FragColor = vec4(tile/255.0, 0.0, 1.0);
  }else{
    gl_FragColor = vec4(value/255.0, 0.0, 1.0);
  }
}

vec2 lookup(float x, float y) {
  return floor(texture2D(tilemap, texCoord + inverseTileTextureSize * vec2( x, y)).xy*256.0);
}

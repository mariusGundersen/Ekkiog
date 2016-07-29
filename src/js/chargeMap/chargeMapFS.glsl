precision mediump float;

uniform sampler2D netMap;
uniform sampler2D netCharges;
varying vec2 mapCoord;

vec3 hsv2rgb(vec3 c);

void main() {
  vec4 netCoord = texture2D(netMap, mapCoord);
  vec4 charge = texture2D(netCharges, netCoord.xy);
  float hue = netCoord.x*255.0/7.7;
  gl_FragColor = vec4(hsv2rgb(vec3(hue, 1.0, charge.x*0.3+0.6)), charge.x);
}

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * normalize(mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y));
}
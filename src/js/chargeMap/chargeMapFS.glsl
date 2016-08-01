precision mediump float;

uniform sampler2D netMap;
uniform sampler2D netCharges;
varying vec2 mapCoord;

void main() {
  vec4 netCoord = texture2D(netMap, mapCoord);
  vec4 charge = texture2D(netCharges, netCoord.xy);
  float hue = floor(mod(netCoord.x*256.0, 6.0));
  if(netCoord.xy == vec2(0.0, 0.0)){
    gl_FragColor = vec4(100.0/255.0, 100.0/255.0, 100.0/255.0, 1.0);
  }else if(hue == 0.0){
    gl_FragColor = charge.x == 1.0
      ? vec4(245.0/255.0, 142.0/255.0, 142.0/255.0, 1.0)
      : vec4(155.0/255.0, 74.0/255.0, 74.0/255.0, 1.0);
  }else if(hue == 1.0){
    gl_FragColor = charge.x == 1.0
      ? vec4(169.0/255.0, 211.0/255.0, 171.0/255.0, 1.0)
      : vec4(80.0/255.0, 100.0/255.0, 81.0/255.0, 1.0);
  }else if(hue == 2.0){
    gl_FragColor = charge.x == 1.0
      ? vec4(254.0/255.0, 211.0/255.0, 127.0/255.0, 1.0)
      : vec4(136.0/255.0, 94.0/255.0, 13.0/255.0, 1.0);
  }else if(hue == 3.0){
    gl_FragColor = charge.x == 1.0
      ? vec4(122.0/255.0, 171.0/255.0, 212.0/255.0, 1.0)
      : vec4(60.0/255.0, 84.0/255.0, 104.0/255.0, 1.0);
  }else if(hue == 4.0){
    gl_FragColor = charge.x == 1.0
      ? vec4(214.0/255.0, 173.0/255.0, 213.0/255.0, 1.0)
      : vec4(107.0/255.0, 69.0/255.0, 106.0/255.0, 1.0);
  }else if(hue == 5.0){
    gl_FragColor = charge.x == 1.0
      ? vec4(121.0/255.0, 212.0/255.0, 213.0/255.0, 1.0)
      : vec4(68.0/255.0, 99.0/255.0, 100.0/255.0, 1.0);
  }else{
    gl_FragColor = vec4(214.0/255.0, 214.0/255.0, 214.0/255.0, 1.0);
  }
}

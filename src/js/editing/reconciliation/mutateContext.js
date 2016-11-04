export function setMap(context, x, y, tile){
  context.mapTexture.set(x, y, tile);
}

export function setNetMap(context, x, y, net){
  context.netMapTexture.set(x, y, net);
}

export function setGate(context, v, a, b){
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}
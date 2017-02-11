import { Context } from '../types';

export function setMap(context : Context, x : number, y : number, tile : number){
  context.mapTexture.set(x, y, tile);
}

export function setNetMap(context : Context, x : number, y : number, net : number){
  context.netMapTexture.set(x, y, net);
}

export function setGate(context : Context, v : number, a : number, b : number){
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}

export function setGateA(context : Context, v : number, a : number){
  const p = context.gatesTexture.get((v>>0)&0xff, (v>>8)&0xff);
  const b = (p>>0)&0xffff;
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}

export function setGateB(context : Context, v : number, b : number){
  const p = context.gatesTexture.get((v>>0)&0xff, (v>>8)&0xff);
  const a = (p>>16)&0xffff;
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}
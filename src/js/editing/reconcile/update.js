
export default function update(context, change){
  switch(change.after.type){
    case 'wire':
      return updateWireNet(context, change, change.after);
    case 'gate':
      return updateGateInput(context, change, change.after);
  }
}

export function updateWireNet(context, {top:y, left:x}, wire){
  context.netMapTexture.set(x, y, wire.net);
}

export function updateGateInput(context, {top:y, left:x}, gate){
  const v = gate.net;
  const a = gate.inputA.net;
  const b = gate.inputB.net;
  context.netMapTexture.set(x, y+0, a);
  context.netMapTexture.set(x, y+2, b);
  context.gatesTexture.set((v>>0)&0xff, (v>>8)&0xff, (a<<16) | (b<<0));
}
export default function mutateContext(context, actions){
  for(let action of actions){
    switch(action.type){
      case 'add':
        setGate(context, action);
      case 'remove':
        clearGate(context, action);
      case 'set':
        setGate(context, action);
    }
  }
}

function setGate(context, action){
  const [x, y] = split(action.address);
  context.gatesTexture.set(x, y, (action.data.a<<16) | (action.data.b<<0));
}

function clearGate(context, action){
  const [x, y] = split(action.address);
  context.gatesTexture.set(x, y, 0);
}

function split(v){
  return [
    (v>>0)&0xff,
    (v>>8)&0xff
  ];
}
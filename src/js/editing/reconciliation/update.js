import {
  setNetMap,
  setGate
} from './mutateContext.js';

export default function update(context, change){
  switch(change.after.type){
    case 'wire':
      return updateWireNet(context, change, change.after);
    case 'gate':
      return updateGateInput(context, change, change.after);
    case 'underpass':
      return updateUnderpassNet(context, change, change.after);
    case 'button':
      return updateButtonState(context, change, change.after);
  }
}

export function updateWireNet(context, {top:y, left:x}, wire){
  setNetMap(context, x, y, wire.net);
}

export function updateGateInput(context, {top:y, left:x}, gate){
  setNetMap(context, x, y+0, gate.inputA.net);
  setNetMap(context, x, y+2, gate.inputB.net);
  setGate(context, gate.net, gate.inputA.net, gate.inputB.net);
}

export function updateUnderpassNet(context, {top:y, left:x}, underpass){
  setNetMap(context, x, y, underpass.net);
}

export function updateButtonState(context, {top:y, lfet:x}, button){
  setGate(context, button.net, button.state, button.state);
}
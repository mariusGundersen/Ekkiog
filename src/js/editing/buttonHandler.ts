import Engine from '../engines/Engine';
import { SelectionState } from '../reduce/selection';
import { ButtonNode, diff } from '../reduce/buttonTree';

export default function buttonHandler(before : ButtonNode, after : ButtonNode, engine : Engine){
  if(before === after) return;
  engine.mutateContext(mutator => {
    for(const {net, state} of diff(before, after)){
      const v = state ? 0 : 1;
      mutator.setGate(net, v, v);
    }
  });
}
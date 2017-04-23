import { Forest } from 'ekkiog-editing';

import Engine from '../engines/Engine';
import mutateContext from './mutateContext';

export default function forestHandler(before : Forest, after : Forest, engine : Engine){
  const changed = mutateContext(engine.context, before, after);
  if(!changed) return;

  engine.simulate();
  engine.update();
}

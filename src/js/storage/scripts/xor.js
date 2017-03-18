import {
  createForest,
  drawSource,
  drawWire,
  drawGate,
  drawDrain
} from 'ekkiog-editing';

export default function xor(){
  let forest = createForest();
  forest = drawSource(forest, 59, 62, 1, 0);
  forest = drawSource(forest, 59, 66, 1, 0);
  forest = drawWire(forest, 60, 63);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 61);
  forest = drawWire(forest, 61, 61);
  forest = drawWire(forest, 62, 61);
  forest = drawWire(forest, 63, 61);
  forest = drawWire(forest, 64, 61);
  forest = drawWire(forest, 65, 61);

  forest = drawWire(forest, 60, 65);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 67);
  forest = drawWire(forest, 61, 67);
  forest = drawWire(forest, 62, 67);
  forest = drawWire(forest, 63, 67);
  forest = drawWire(forest, 64, 67);
  forest = drawWire(forest, 65, 67);

  forest = drawGate(forest, 64, 64);
  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);

  forest = drawGate(forest, 69, 62);
  forest = drawGate(forest, 69, 66);

  forest = drawWire(forest, 70, 62);
  forest = drawWire(forest ,70, 63);

  forest = drawWire(forest, 70, 65);
  forest = drawWire(forest ,70, 66);

  forest = drawGate(forest, 74, 64);
  forest = drawWire(forest, 75, 64);
  forest = drawDrain(forest, 76, 64, 1, 0);

  return forest;
}
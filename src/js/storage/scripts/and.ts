import {
  createForest,
  drawButton,
  drawWire,
  drawGate,
  drawLight
} from '../../editing';

export default function and() {
  let forest = createForest();
  forest = drawButton(forest, 58, 62);
  forest = drawWire(forest, 60, 62);
  forest = drawWire(forest, 60, 63);

  forest = drawButton(forest, 58, 66);
  forest = drawWire(forest, 60, 66);
  forest = drawWire(forest, 60, 65);

  forest = drawGate(forest, 64, 64);

  forest = drawWire(forest, 65, 63);
  forest = drawWire(forest, 65, 64);
  forest = drawWire(forest, 65, 65);

  forest = drawGate(forest, 69, 64);

  forest = drawLight(forest, 71, 64);
  return forest;
}

import { get } from "ennea-tree";
import { Forest } from "../types";

export default function getTileAt(forest: Forest, x: number, y: number) {
  return get(forest.enneaTree, y, x);
}

import { get } from "ennea-tree";
import { EnneaTree } from "../types";

export default function getTileAt(forest: { enneaTree: EnneaTree }, x: number, y: number) {
  return get(forest.enneaTree, y, x);
}

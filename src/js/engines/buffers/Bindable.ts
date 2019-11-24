import { AtomicBind } from "./types";

export default abstract class AbstractBindlable {
  constructor(atomicBind: AtomicBind) {
    this.bind = atomicBind(this);
  }

  abstract _bind(): void;

  bind() {
  }
}
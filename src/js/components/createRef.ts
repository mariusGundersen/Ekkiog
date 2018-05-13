export interface Ref<T> {
  (ref : T) : void
  current : T | null
}

export default function createRef<T>() : Ref<T> {
  const set : any = (ref : T) => set.current = ref;
  set.current = null;
  return set;
}
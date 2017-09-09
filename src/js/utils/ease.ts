export type Step = (delta : number) => number[] | undefined;

export type Ease = (ratio : number) => number;

export const easeOut = (r : number) => r*(2-r);

export default function* ease(start : number[], end: number[], ease : Ease, duration : number) : IterableIterator<number[]> {
  let time = 0;
  const fromTo = start.map((from, i) => ({from, distance: end[i] - from}));
  let delta = 0;
  while(time < duration){
    const ratio = ease(time/duration);
    delta = yield fromTo.map(x => x.from + ratio*x.distance);
    time += delta;
  }
  yield fromTo.map(x => x.from + x.distance);
}
export type Step = (delta : number) => number[] | undefined;

export type Ease = (ratio : number) => number;

export const easeOut = (r : number) => r*(2-r);

export default function ease(start : number[], end: number[], ease : Ease, duration : number) : Step{
  let time = 0;
  const fromTo = start.map((from, i) => ({from, distance: end[i] - from}));
  return function step(delta : number){
    if(time > duration) return undefined;

    time += delta;
    const ratio = time > duration ? 1 : ease(time/duration);
    return fromTo.map(x => x.from + ratio*x.distance);
  }
}
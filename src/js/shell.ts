export interface Options{
  tickInterval : number;
  readonly render : (delta : number, now : number) => void;
  readonly tick : (tickCount : number) => void;
}

export interface Config{
  setTickInterval(tickInterval : number) : void;
  tick(delta : number) : void;
}

export default function startShell(options : Options) : Config{

  /* RENDER */
  let earlier = window.performance.now();
  const onFrameRequest = (now : number) => {
    window.requestAnimationFrame(onFrameRequest);
    options.render(now - earlier, now);
    earlier = now;
  }
  window.requestAnimationFrame(onFrameRequest);

  /* TICK */
  const tick = {
    count: 0,
    timeout: 0,
    interval: options.tickInterval
  };
  const onTickRequest = () => {
    time(tick, onTickRequest);

    if(tick.interval < 16){
      for(let d=16; d>tick.interval; d-=tick.interval){
        options.tick(tick.count++);
      }
    }else{
      options.tick(tick.count++);
    }
  }
  time(tick, onTickRequest);

  return {
    setTickInterval(tickInterval : number){
      if(tick.interval === tickInterval) return;
      tick.interval = tickInterval;
      clearTimeout(tick.timeout);
      time(tick, onTickRequest);
    },
    tick(delta : number){
      if(delta > 0){
        tick.count += delta;
        options.tick(tick.count);
      }
    }
  };
};

function time(options : {interval : number, timeout : number}, callback : () => void){
  if(Number.isFinite(options.interval)){
    options.timeout = setTimeout(callback, Math.max(16, options.interval)) as any;
  }
}
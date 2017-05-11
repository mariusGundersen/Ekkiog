export interface Options{
  tickInterval : number;
  readonly render : () => void;
  readonly tick : (tickCount : number) => void;
  readonly resize : (
    pixelWidth : number,
    pixelHeight : number) => void;
}

export interface Config{
  setTickInterval(tickInterval : number) : void;
}

export default function startShell(options : Options) : Config{

  /* RENDER */
  const onFrameRequest = () => {
    window.requestAnimationFrame(onFrameRequest);
    options.render();
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

  /* RESIZE */
  const onResizeRequest = () => {
    const screenWidth = window.document.body.clientWidth;
    const screenHeight = window.document.body.clientHeight;
    const pixelWidth = screenWidth*window.devicePixelRatio;
    const pixelHeight = screenHeight*window.devicePixelRatio;
    options.resize(pixelWidth, pixelHeight);
  };
  window.addEventListener('resize', onResizeRequest)
  onResizeRequest();

  return {
    setTickInterval(tickInterval : number){
      tick.interval = tickInterval;
      clearTimeout(tick.timeout);
      time(tick, onTickRequest);
    }
  };
};

function time(options : {interval : number, timeout : number}, callback : () => void){
  if(Number.isFinite(options.interval)){
    options.timeout = setTimeout(callback, Math.max(16, options.interval)) as any;
  }
}
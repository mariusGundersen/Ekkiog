export interface Options{
  tickInterval : number;
  readonly render : () => void;
  readonly tick : (tickCount : number) => void;
  readonly resize : (
    width : number,
    height : number,
    screenWidth : number,
    screenHeight : number) => void;
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
  let tickCount = 0;
  const onTickRequest = () => {
    setTimeout(onTickRequest, options.tickInterval);
    options.tick(tickCount++);
  }
  setTimeout(onTickRequest, options.tickInterval);

  /* RESIZE */
  const onResizeRequest = () => {
    const screenWidth = window.document.body.clientWidth;
    const screenHeight = window.document.body.clientHeight;
    const width = screenWidth*window.devicePixelRatio;
    const height = screenHeight*window.devicePixelRatio;
    options.resize(width, height, screenWidth, screenHeight);
  };
  window.addEventListener('resize', onResizeRequest)
  onResizeRequest();

  return {
    setTickInterval(tickInterval : number){
      options.tickInterval = tickInterval;
    }
  };
};
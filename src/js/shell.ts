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
    const pixelWidth = screenWidth*window.devicePixelRatio;
    const pixelHeight = screenHeight*window.devicePixelRatio;
    options.resize(pixelWidth, pixelHeight);
  };
  window.addEventListener('resize', onResizeRequest)
  onResizeRequest();

  return {
    setTickInterval(tickInterval : number){
      options.tickInterval = tickInterval;
    }
  };
};
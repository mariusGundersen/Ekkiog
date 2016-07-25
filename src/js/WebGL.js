export default class WebGL{
  constructor(canvas, options){
    this.canvas = canvas;
    this.gl = getContext(canvas);
    this.options = options || {};

  }

  render(render){
    const onFrameRequest = () => {
      window.requestAnimationFrame(onFrameRequest);
      render();
    }
    window.requestAnimationFrame(onFrameRequest);
  }

  tick(tick){
    let tickCount = 0;
    const onTickRequest = () => {
      setTimeout(onTickRequest, this.options.tickInterval);
      tick(tickCount++);
    }
    setTimeout(onTickRequest, this.options.tickInterval);
  }

  resize(resize){
    const onResizeRequest = e => {
      this.canvas.width = this.canvas.offsetWidth*window.devicePixelRatio;
      this.canvas.height = this.canvas.offsetHeight*window.devicePixelRatio;
      resize(this.canvas.width, this.canvas.height);
    };
    window.addEventListener('resize', onResizeRequest)
    onResizeRequest();
  }
}


function getContext(canvas) {
  return canvas.getContext("webgl", {})
      || canvas.getContext("experimental-webgl", {});
}
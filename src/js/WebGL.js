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
      this.canvas.width = window.document.body.clientWidth*window.devicePixelRatio;
      this.canvas.height = window.document.body.clientHeight*window.devicePixelRatio;
      resize(this.canvas.width, this.canvas.height, window.document.body.clientWidth, window.document.body.clientHeight);
    };
    window.addEventListener('resize', onResizeRequest)
    onResizeRequest();
  }
}


function getContext(canvas) {
  return canvas.getContext("webgl", {})
      || canvas.getContext("experimental-webgl", {});
}
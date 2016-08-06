export default class Shell{
  constructor(options){
    this.options = options || {};

    if(this.options.render){
      const onFrameRequest = () => {
        window.requestAnimationFrame(onFrameRequest);
        this.options.render();
      }
      window.requestAnimationFrame(onFrameRequest);
    }

    if(this.options.tick){
      let tickCount = 0;
      const onTickRequest = () => {
        setTimeout(onTickRequest, this.options.tickInterval);
        this.options.tick(tickCount++);
      }
      setTimeout(onTickRequest, this.options.tickInterval);
    }

    if(this.options.resize){
      const onResizeRequest = e => {
        const screenWidth = window.document.body.clientWidth;
        const screenHeight = window.document.body.clientHeight;
        const width = screenWidth*window.devicePixelRatio;
        const height = screenHeight*window.devicePixelRatio;
        this.options.resize(width, height, screenWidth, screenHeight);
      };
      window.addEventListener('resize', onResizeRequest)
      onResizeRequest();
    }
  }
}
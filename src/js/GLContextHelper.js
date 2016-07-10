/*
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

export default class GLContextHelper {
  constructor(canvas) {
    let resizeTimeout;

    //
    // Create gl context and start the render loop
    //
    this.canvas = canvas;
    this.mobileDevice = false;
    this.forceMobile = false;
    this.lastWidth = 0;
    this.renderer = null;
    this.canvasScale = 1.0;

    this.gl = getContext(canvas, {alpha: false});

    if(!this.gl) {
      showGLFailed(canvas);
    } else {
      // On mobile devices, the canvas size can change when we rotate. Watch for that:
      document.addEventListener("orientationchange", () => this.windowResized(), false);

      // Note: This really sucks, but it's apparently the best way to get this to work on Opera mobile
      window.addEventListener("resize", () => {
        if(resizeTimeout) { clearTimeout(resizeTimeout); }
        resizeTimeout = setTimeout(() => this.windowResized(), 250);
      }, false);
    }
  }

  start(renderer, stats) {
    if(!renderer.draw) {
      throw new Error("Object passed to startRenderLoop must have a draw function");
    }

    this.renderer = renderer;

    const startTime = Date.now();
    let lastTimeStamp = startTime;

    const timingData = {
      startTime: startTime,
      timeStamp: 0,
      elapsed: 0,
      frameTime: 0
    };

    this.windowResized(true);

    const nextFrame = () => {
      const time = Date.now();
      // Recommendation from Opera devs: calling the RAF shim at the beginning of your
      // render loop improves framerate on browsers that fall back to setTimeout
      window.requestAnimationFrame(nextFrame, this.canvas);

      timingData.timeStamp = time;
      timingData.elapsed = time - startTime;
      timingData.frameTime = time - lastTimeStamp;

      if(stats) { stats.begin(); }
      renderer.draw(this.gl, timingData);
      if(stats) { stats.end(); }

      lastTimeStamp = time;
    }

    window.requestAnimationFrame(nextFrame, this.canvas);
  }

  windowResized(force) {
    if(this.lastWidth === window.innerWidth && !force) { return; }

    // We'll consider "mobile" and "screen deprived" to be the same thing :)
    this.lastWidth = window.innerWidth;
    this.mobileDevice = this.forceMobile || (screen.width <= 960);

    // If we don't set this here, the rendering will be skewed
    if(this.mobileDevice) {
      this.canvas.width = window.innerWidth * window.devicePixelRatio;
      this.canvas.height = window.innerHeight * window.devicePixelRatio;
    } else {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }

    if(this.renderer && this.renderer.resize) {
      this.renderer.resize(this.gl, this.canvas);
    }
  }
}

function getContext(canvas, options) {
  var context;

  if (canvas.getContext) {
    try {
      context = canvas.getContext('webgl', options);
      if(context) { return context; }
    } catch(ex) {}

    try {
      context = canvas.getContext('experimental-webgl', options);
      if(context) { return context; }
    } catch(ex) {}
  }

  return null;
}

function showGLFailed(element) {
  var errorHTML = `<h3>Sorry, but a WebGL context could not be created</h3>
    Either your browser does not support WebGL, or it may be disabled.<br/>
    Please visit <a href=\"http://get.webgl.org\">http://get.webgl.org</a> for
    details on how to get a WebGL enabled browser.`;

  var errorElement = document.createElement("div");
  errorElement.innerHTML = errorHTML;
  errorElement.id = "gl-error";
  element.parentNode.replaceChild(errorElement, element);
}
import {vec2} from 'gl-matrix';

import Texture from './Texture';

export default class ImageTexture extends Texture{
  image? : HTMLImageElement;
  constructor(gl : WebGLRenderingContext, image : HTMLImageElement){
    super(gl, 0);
    this.width = image.width;
    this.height = image.height;
    this.image = image;

    vec2.set(this.size, image.width, image.height);
    vec2.set(this.halfSize, image.width/2, image.height/2);
    vec2.set(this.inverseSize, 1/image.width, 1/image.height);

    this.update();
  }

  update(){
    if(this.image === undefined) return;

    this.bind();

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
  }
}
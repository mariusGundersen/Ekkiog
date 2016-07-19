import ndarray from 'ndarray';

export default class Map{
  constructor(width=128, height=width, data=[]){
    this.data = new Uint8Array(width*height*4);
    this.map = ndarray(this.data, [height, width, 4]);
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        this.map.set(y, x, 0, data[y*height + x]);
      }
    }
    this.width = width;
    this.height = height;
    this.listener = () => {};
  }

  set(x, y, v=1){
    this.map.set(y, x, 0, v);
    this.listener(x, y);
  }

  get(x, y){
    return this.map.get(y, x, 0) || 0;
  }

  toggle(x, y){
    this.set(x, y, this.get(x, y) ? 0 : 1);
  }

  onChange(listener){
    this.listener = listener;
  }

  export(){
    const data = [];

    for(let y=0; y<this.height; y++){
      for(let x=0; x<this.width; x++){
        data[y*this.height + x] = this.map.get(y, x, 0);
      }
    }

    return {
      width: this.width,
      height: this.height,
      data: data
    };
  }

  static from(map = {}){
    return new Map(map.width, map.height, map.data);
  }
}
export default class Map{
  constructor(width=128, height=width, data=[]){
    this.map = new Array(width*height);
    for(let y=0; y<height; y++){
      for(let x=0; x<width; x++){
        this.map[y*width + x] = data[y*width + x] || 0;
      }
    }
    this.width = width;
    this.height = height;
    this.listener = () => {};
  }

  set(x, y, v=1){
    this.map[y*this.width + x] = v;
    this.listener(x, y);
  }

  get(x, y){
    return this.map[y*this.width + x] || 0;
  }

  toggle(x, y){
    this.set(x, y, this.get(x, y) ? 0 : 1);
  }

  onChange(listener){
    this.listener = listener;
  }

  export(){
    return {
      width: this.width,
      height: this.height,
      data: this.map
    };
  }

  static from(map = {}){
    return new Map(map.width, map.height, map.data);
  }
}
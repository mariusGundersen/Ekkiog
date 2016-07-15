export default class Map{
  constructor(width=100, height=width){
    this.map = new Array(width*height);
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
    this.set(x, y, (this.get(x, y)+1)%16);
    this.listener(x, y);
  }

  onChange(listener){
    this.listener = listener;
  }
}
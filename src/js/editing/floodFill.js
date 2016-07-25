import ndarray from 'ndarray';

export default function floodFill(x, y, w, h, condition, fill){
  const visited = ndarray(new Uint8Array(w*h), [w, h]);
  const tcoQueue = [{x,y}];
  while(tcoQueue.length > 0){
    const {x, y} = tcoQueue.shift();
    if(visited.get(x, y) == 0 && condition(x, y)){
      visited.set(x, y, 1);
      fill(x, y);

      if(x < w-1 && visited.get(x+1, y+0) == 0)
        tcoQueue.push({x: x+1, y: y+0});
      if(x > 0 && visited.get(x-1, y+0) == 0)
        tcoQueue.push({x: x-1, y: y+0});
      if(y < h-1 && visited.get(x+0, y+1) == 0)
        tcoQueue.push({x: x+0, y: y+1});
      if(y > 0 && visited.get(x+0, y-1) == 0)
        tcoQueue.push({x: x+0, y: y-1});
    }
  }
}
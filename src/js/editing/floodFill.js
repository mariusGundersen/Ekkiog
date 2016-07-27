import ndarray from 'ndarray';

export default function floodFill(x, y, w, h, getNeighbours, fill){
  const visited = ndarray(new Uint8Array(w*h), [w, h]);
  const tcoQueue = [{x,y}];
  while(tcoQueue.length > 0){
    const {x, y} = tcoQueue.shift();
    if(visited.get(x, y) == 0){
      visited.set(x, y, 1);
      fill(x, y);

      for(let [dx, dy] of getNeighbours(x, y)){
        if(visited.get(x+dx, y+dy) == 1) continue;
        if(x+dx < w-1 && x+dx > 0
        && y+dy < h-1 && y+dy > 0){
          tcoQueue.push({x: x+dx, y: y+dy});
        }
      }
    }
  }
}
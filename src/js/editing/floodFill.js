import ndarray from 'ndarray';

export default function floodFill(x, y, w, h, getNeighbours, fill){
  const visited = ndarray(new Uint8Array(w*h), [w, h]);
  const tcoQueue = [{x,y}];
  while(tcoQueue.length > 0){
    const {x, y} = tcoQueue.shift();
    if(visited.get(x, y) == 0){
      visited.set(x, y, 1);
      fill(x, y);

      const neighbours = getNeighbours(x, y);
      for(let [x, y] of neighbours){
        if(visited.get(x, y) == 1) continue;
        if(x < w-1 && x > 0
        && y < h-1 && y > 0){
          tcoQueue.push({x: x, y: y});
        }
      }
    }
  }
}
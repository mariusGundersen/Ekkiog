export default function floodFill(x, y, condition, fill){
  const tcoQueue = [{x,y}];
  while(tcoQueue.length > 0){
    const {x, y} = tcoQueue.shift();
    if(condition(x, y)){
      fill(x, y);

      if(condition(x+1, y+0))
        tcoQueue.push({x: x+1, y: y+0});
      if(condition(x-1, y+0))
        tcoQueue.push({x: x-1, y: y+0});
      if(condition(x+0, y+1))
        tcoQueue.push({x: x+0, y: y+1});
      if(condition(x+0, y-1))
        tcoQueue.push({x: x+0, y: y-1});
    }
  }
}
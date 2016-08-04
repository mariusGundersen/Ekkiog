import ndarray from 'ndarray';

export default class FloodFiller{
  constructor(context, query){
    this.context = context;
    this.query = query;
    this.visitedMap = ndarray(new Uint8Array(context.width*context.height), [context.width, context.height]);
  }

  floodFill(x, y, net){
    this.visitedMap.data.fill(0);
    const tcoQueue = [{x,y}];
    const gatesToUpdate = [];
    while(tcoQueue.length > 0){
      const {x, y} = tcoQueue.shift();
      if(this.visitedMap.get(x, y) == 0){
        this.visitedMap.set(x, y, 1);
        if(!this.query.isNetSource(x, y)){
          this.context.netMapTexture.set(x, y, net);
          if(this.query.isGateInput(x, y)){
            gatesToUpdate.push(this.query.getGateForInput(x, y));
          }
        }

        const neighbours = this.query.getSearchDirections(x, y, this.query.getTileType(x, y));
        for(let [x, y] of neighbours){
          if(this.visitedMap.get(x, y) == 1) continue;
          tcoQueue.push({x: x, y: y});
        }
      }
    }
    return gatesToUpdate;
  }
}
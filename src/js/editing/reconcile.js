export default function reconcile(context, changes){
  for(const change of changes){
    switch(change.type){
      case 'set':
        setMapTexture(context, change, tile(change.after.type));
        break;
      case 'clear':
        setMapTexture(context, change, 0);
        break;
    }
  }
}

export function setMapTexture(context, {top, left, width, height}, tile){
  for(let y=top; y<top+height; y++){
    for(let x=left; x<left+width; x++){
      context.mapTexture.set(x, y, tile);
    }
  }
}

export function tile(type){
  switch(type){
    case 'wire':
      return 1;
    default:
      return 0;
  }
}
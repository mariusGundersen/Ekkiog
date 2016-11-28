export default function makePos({top, left}, net, dx=0, dy=0){
  return {
    area: {
      top: top+dy,
      left: left+dx
    },
    context: {
      net,
      pos: {
        top: top+dy,
        left: left+dx
      },
      prev: {
        top,
        left
      }
    }
  };
}
export function get(quadtree, x, y){
  if(quadtree == null) return null;

  if(quadtree.size === 1) return quadtree.data;

  const midpoint = quadtree.size/2;
  return (x < midpoint && y < midpoint)
    ? get(quadtree.ne, x, y)
    : (x >= midpoint && y < midpoint)
    ? get(quadtree.nw, x - midpoint, y)
    : (x < midpoint && y >= midpoint)
    ? get(quadtree.se, x, y - midpoint)
    : (x >= midpoint && y >= midpoint)
    ? get(quadtree.sw, x - midpoint, y - midpoint)
    : null;
}

export function set(quadtree, x, y, data){
  if(quadtree == null){
    if(data === null) return null;

    const result = createNode(1);
    result.data = data;
    return result;
  }

  if(quadtree.size === 1){
    if(data === null) return null;

    return {
      ...quadtree,
      data
    };
  }

  const midpoint = quadtree.size/2;
  const result =
    (x < midpoint && y < midpoint)
    ? {
      ...quadtree,
      ne: set(quadtree.ne, x, y, data)
    }
    : (x >= midpoint && y < midpoint)
    ? {
      ...quadtree,
      nw: set(quadtree.nw, x - midpoint, y, data)
    }
    : (x < midpoint && y >= midpoint)
    ? {
      ...quadtree,
      se: set(quadtree.se, x, y - midpoint, data)
    }
    : (x >= midpoint && y >= midpoint)
    ? {
      ...quadtree,
      sw: set(quadtree.sw, x - midpoint, y - midpoint, data)
    } : null;

  if((result.ne || result.nw || result.se || result.sw) === null) return null;

  return result;
}

export function clear(quadtree, x, y){
  return set(quadtree, x, y, null);
}

export function createNode(size){
  return {
    size,
    data: null,
    ne: null,
    nw: null,
    se: null,
    sw: null
  }
}
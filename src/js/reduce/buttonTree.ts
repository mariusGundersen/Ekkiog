export interface ButtonLeaf {
  readonly halfSize : 0
  readonly state : boolean
}

export interface ButtonNode {
  readonly left? : ButtonNode | ButtonLeaf
  readonly right? : ButtonNode | ButtonLeaf
  readonly halfSize : number
}

export interface ButtonState {
  readonly net : number
  readonly state : boolean
}

export function createButtonTree(size : number) : ButtonNode {
  return {
    halfSize: size>>1
  };
}

export function toggleButton(tree : ButtonLeaf | ButtonNode, net : number) : ButtonNode | ButtonLeaf {
  if(isLeaf(tree)){
    return {
      ...tree,
      state: !tree.state
    };
  }else{
    if(net < tree.halfSize){
      return {
        ...tree,
        left: toggleButton(tree.left || createButtonTree(tree.halfSize), net)
      }
    }else{
      return {
        ...tree,
        right: toggleButton(tree.right || createButtonTree(tree.halfSize), net - tree.halfSize)
      }
    }
  }
}

export function* diff(before : ButtonLeaf | ButtonNode | undefined, after : ButtonLeaf | ButtonNode | undefined, address = 0) : IterableIterator<ButtonState> {
  if(before === after) return;
  if(after){
    if(before){
      if(isLeaf(before) && isLeaf(after)) {
        if(before.state !== after.state){
          yield {
            net: address,
            state: after.state
          };
        }
      }else if(!isLeaf(before) && !isLeaf(after)){
        yield* diff(before.left, after.left, address);
        yield* diff(before.right, after.right, address + before.halfSize);
      }else{
        //this never happens if before and after are the same size
      }
    }else{
      if(isLeaf(after)){
        if(after.state){
          yield {
            net: address,
            state: after.state
          };
        }
      }else{
        yield* diff(before, after && after.left, address);
        yield* diff(before, after && after.right, address + after.halfSize);
      }
    }
  }
}

function isLeaf(node : ButtonLeaf | ButtonNode) : node is ButtonLeaf {
  return node.halfSize === 0;
}
export function allocate(memoryTree, size=1){
  const level = log2(size);
  const result = findFreeNode(memoryTree, level);
  if(result){
    result.used = true;
    return result.address;
  }else{
    return -1;
  }
}

function findFreeNode(node, level){
  if(node.level < level){
    return null;
  }

  if(node.used){
    return null;
  }

  if(node.level === level){
    if(node.left === null && node.right === null){
      return node;
    }else{
      return null;
    }
  }

  if(node.left == null){
    node.left = createFromLevel(node.level-1, node.address);
  }

  const resultLeft = findFreeNode(node.left, level);
  if(resultLeft != null){
    return resultLeft;
  }

  if(node.right == null){
    node.right = createFromLevel(node.level-1, node.address + node.size/2);
  }

  const resultRight = findFreeNode(node.right, level);
  if(resultRight != null){
    return resultRight;
  }

  return null;
}

export function addData(node, data, size){
  if(node === null){
    return [{
      ...createFromSize(size),
      data
    }, 0];
  }

  if(node.size < size){
    return [node, -1];
  }

  if(node.data !== null){
    return [node, -1];
  }

  if(node.size >= size && node.size>>1 < size){
    if(node.left === null && node.right === null){
      return [{
        ...node,
        data
      }, node.address];
    }else{
      return [node, -1];
    }
  }

  if(node.left == null){
    node = {
      ...node,
      left: createFromSize(node.size>>1, node.address)
    };
  }

  {
    const [result, address] = addData(node.left, data, size);
    if(result != node.left){
      return [{
        ...node,
        left: result
      }, address];
    }
  }

  if(node.right == null){
    node = {
      ...node,
      right: createFromSize(node.size>>1, node.address + node.size/2)
    };
  }

  {
    const [result, address] = addData(node.right, data, size);
    if(result != node.right){
      return [{
        ...node,
        right: result
      }, address];
    }
  }

  return [node, -1];
}

export function deallocate(memoryTree, address, size=1){
  const level = log2(size);
  const result = findNode(memoryTree, address, level);
}

function findNode(node, address, level){
  if(node.level < level){
    return node;
  }

  if(node.level === level){
    node.used = false;
    node.left = null;
    node.right = null;
    return null;
  }

  if(address < node.address + node.size/2){
    if(node.left){
      node.left = findNode(node.left, address, level);
    }
  }else{
    if(node.right){
      node.right = findNode(node.right, address, level);
    }
  }

  if(node.left == null && node.right == null){
    return null;
  }else{
    return node;
  }
}

export function clearData(node, address){
  if(node == null){
    return null;
  }

  if(node.data != null){
    return null;
  }

  if(address < node.address + node.size>>1){
    if(node.left){
      node = {
        ...node,
        left: clearData(node.left, address)
      };
    }
  }else{
    if(node.right){
      node = {
        ...node,
        right: clearData(node.right, address)
      };
    }
  }

  if(node.left == null && node.right == null){
    return null;
  }else{
    return node;
  }
}

export function setData(node, address, data){
  if(node == null){
    return null;
  }

  if(node.data != null){
    return {
      ...node,
      data
    };
  }

  if(address < node.address + node.size/2){
    if(node.left){
      node = {
        ...node,
        left: setData(node.left, address, data)
      };
    }
  }else{
    if(node.right){
      node = {
        ...node,
        right: setData(node.right, address, data)
      };
    }
  }

  if(node.left == null && node.right == null){
    return null;
  }else{
    return node;
  }
}

export function serialize(node){
  if(!node){
    return [];
  }else if(node.used){
    return [node.size];
  }else{
    return [...serialize(node.left), ...serialize(node.right)];
  }
}

export function deserialize(treeSize, memory){
  const memoryTree = createFromSize(treeSize);
  for(let size of memory){
    allocate(memoryTree, size);
  }
  return memoryTree;
}

export function createMemoryTree(size){
  let tree = createFromSize(size);
  tree = allocate(tree);//ground
  tree = allocate(tree);//charge
  return tree;
}

export function createFromSize(size, address=0){
  return createFromLevel(log2(size), address);
}

export function createFromLevel(level, address=0){
  return {
    data: null,
    used: false,
    left: null,
    right: null,
    level: level,
    size: 1<<level,
    address: address
  };
}

export function log2(x){
  return Math.ceil(Math.log(x)/Math.LN2);
}

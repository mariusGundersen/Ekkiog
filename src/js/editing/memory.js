import * as memoryNode from '../textures/memoryNode.js';

export function allocate(memoryTree, size=1){
  const level = memoryNode.log2(size);
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
    node.left = createNode(node.level-1, node.address);
  }

  const resultLeft = findFreeNode(node.left, level);
  if(resultLeft != null){
    return resultLeft;
  }

  if(node.right == null){
    node.right = createNode(node.level-1, node.address + node.size/2);
  }

  const resultRight = findFreeNode(node.right, level);
  if(resultRight != null){
    return resultRight;
  }

  return null;
}

export function deallocate(memoryTree, address, size=1){
  const level = memoryNode.log2(size);
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

export function createNode(level, address=0){
  return memoryNode.createFromLevel(level, address);
}

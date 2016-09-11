export function setUsed(memoryTree, address, size=1){
  const width = Math.ceil(log2(size));
  const maxDepth = log2(memoryTree.length);
  setUsedRecursive(memoryTree, address, maxDepth-width, maxDepth);
}

function setUsedRecursive(memoryTree, address, depth, maxDepth=depth){
  if(depth < 0) return;

  const bit = 0x1 << maxDepth - depth;
  const buddy = memoryTree[address^bit];

  memoryTree[address] |= bit;
  if((buddy & bit) !== 0){
    setUsedRecursive(memoryTree, address & ~bit, depth-1, maxDepth);
  }
}

export function clearUsed(memoryTree, address, size=1){
  const width = Math.ceil(log2(size));
  const maxDepth = log2(memoryTree.length);
  clearUsedRecursive(memoryTree, address, maxDepth-width, maxDepth);
}

function clearUsedRecursive(memoryTree, address, depth, maxDepth=depth){
  if(depth < 0) return;

  const bit = 0x1 << maxDepth - depth;
  const buddy = memoryTree[address^bit];

  memoryTree[address] &= ~bit;
  if((buddy & bit) !== 0){
    clearUsedRecursive(memoryTree, address & ~bit, depth-1, maxDepth);
  }
}

export function findFreeAddress(memoryTree, size=1){
  const width = Math.ceil(log2(size));
  const maxDepth = log2(memoryTree.length);
  return findUnusedRecursive(memoryTree, 0, width, 0, maxDepth);
}

function findUnusedRecursive(memoryTree, address, width, depth, maxDepth){
  if(depth+width > maxDepth) {
    const bits = (0x1 << maxDepth - depth + 1)-1;
    if((memoryTree[address] & bits) === 0){
      return address;
    }else{
      return -1;
    }
  }

  const bit = 0x1 << maxDepth - depth;
  const buddyAddress = address^bit;

  if((memoryTree[address] & bit) === 0){
    const result = findUnusedRecursive(memoryTree, address, width, depth+1, maxDepth);
    if(result != -1) return result;
  }

  if((memoryTree[buddyAddress] & bit) === 0){
    const result = findUnusedRecursive(memoryTree, address | bit, width, depth+1, maxDepth);
    if(result != -1) return result;
  }

  return -1;
}

function log2(x){
  return Math.log(x)/Math.LN2;
}
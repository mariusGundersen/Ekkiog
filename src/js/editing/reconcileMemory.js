export default function reconcileMemory(oldMemory, newMemory){
  return [...reconcileMemoryInternal(oldMemory, newMemory)];
}

function *reconcileMemoryInternal(oldMemory, newMemory){
  if(oldMemory === newMemory){
    return;
  }

  if(oldMemory === null){
    if(newMemory.data === null){
      yield *reconcileMemoryInternal(null, newMemory.left);
      yield *reconcileMemoryInternal(null, newMemory.right);
    }else{
      yield {type:'add', data: newMemory.data, address: newMemory.address};
    }
  }else if(newMemory === null){
    if(oldMemory.data === null){
      yield *reconcileMemoryInternal(oldMemory.left, null);
      yield *reconcileMemoryInternal(oldMemory.right, null);
    }else{
      yield {type:'remove', data: oldMemory.data, address: oldMemory.address};
    }
  }else{
    if(oldMemory.left != newMemory.left){
      yield *reconcileMemoryInternal(oldMemory.left, newMemory.left);
    }
    if(oldMemory.right != newMemory.right){
      yield *reconcileMemoryInternal(oldMemory.right, newMemory.right);
    }
    if(oldMemory.data != newMemory.data){
      yield {type:'set', data: newMemory.data, address: newMemory.address};
    }
  }
}
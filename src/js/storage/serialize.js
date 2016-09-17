export default function serialize(array){
  const content = [];
  for(let i=0; i<array.length; i++){
    let repeats = 1;
    const value = array[i];
    while(i+1 < array.length && array[i+1] === value){
      i++;
      repeats++;
    }
    if(repeats>1){
      content.push(`#${repeats.toString(16)}x${value.toString(16)}`);
    }else{
      content.push(value.toString(16));
    }
  }
  return `(32)${array.length.toString(16)}:${content.join(',')}`
}

export function to32Bit(array){
  return new Uint32Array(array.buffer);
}
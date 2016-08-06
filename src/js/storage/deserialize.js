export default function deserialize(string){
  const [sizeAndLength, content] = string.split(':');
  const output = sizeAndLength.match(/\(32\)\d+/)
    ? new Uint32Array(parseInt(/\(32\)(\d+)/.exec(sizeAndLength)[1], 16))
    : new Uint8Array(parseInt(sizeAndLength, 16));
  let i=0;
  for(let item of content.split(',')){
    if(item[0] == '#'){
      const [_, repeatString, valueString] = /#([0-9a-f]+)x([0-9a-f]+)/.exec(item);
      const value = parseInt(valueString, 16);
      const repeats = parseInt(repeatString, 16);
      if(value === '0'){
        i+= repeats;
      }else{
        for(let r=0; r<repeats; r++, i++){
          output[i] = value;
        }
      }
    }else{
      output[i++] = parseInt(item, 16);
    }
  }
  return new Uint8Array(output.buffer);
}
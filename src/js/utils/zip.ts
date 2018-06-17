export function* zip<TA, TB>(a : TA[], b : TB[]){
  for(let i=0; i<a.length; i++){
    yield [a[i], b[i], i] as [TA, TB, number];
  }
}
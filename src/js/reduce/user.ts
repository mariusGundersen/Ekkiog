import * as storage from '../storage';

export default function user(state : any){
  if(state === undefined){
    return storage.getUser();
  }else{
    return state;
  }
}
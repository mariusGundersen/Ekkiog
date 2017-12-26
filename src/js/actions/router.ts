import { replace } from "react-router-redux";

export default function setUrl(repo : string, name : string){
  if(repo.length > 0){
    return replace(`?repo=${repo}&component=${name}`);
  }else{
    return replace(`?component=${name}`);
  }
}
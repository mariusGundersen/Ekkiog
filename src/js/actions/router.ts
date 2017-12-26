import { replace } from "react-router-redux";

export default function setUrl(repo : string, name : string){
  if(repo.length > 0){
    return replace(`?repo=${encodeURIComponent(repo)}&component=${encodeURIComponent(name)}`);
  }else{
    return replace(`?component=${encodeURIComponent(name)}`);
  }
}
import { replace } from "react-router-redux";

export default function setUrl(repo : string, name : string){
  if(repo.length > 0){
    return replace(`/c/${name}/${repo}`);
  }else{
    return replace(`/c/${name}`);
  }
}
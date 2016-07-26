const PATH = 'ekkiog[0.0.2].save';

export default class Storage{
  save(map){
    localStorage.setItem(PATH, JSON.stringify(map));
  }

  load(){
    try{
      return JSON.parse(localStorage.getItem(PATH)) || undefined;
    }catch(e){
      return undefined;
    }
  }
}
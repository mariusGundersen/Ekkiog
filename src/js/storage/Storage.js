const PATH = 'ekkiog[0.0.4].save';

export default class Storage{
  save(map){
    localStorage.setItem(PATH, JSON.stringify(map));
  }

  load(){
    try{
      return JSON.parse(localStorage.getItem(PATH)) || DEFAULT;
    }catch(e){
      return DEFAULT;
    }
  }
}

const DEFAULT = {"width":128,"height":128,"map":"(32)4000:#1ebcx0,#6x1,#79x0,4,1,#8x0,2,1,#75x0,1,#4x0,1,#4x0,1,#4x0,#3x1,#72x0,2,1,#8x0,2,#3x1,#6ex0,1,#4x0,1,#4x0,1,#4x0,#3x1,#6dx0,4,1,#8x0,2,1,#75x0,#6x1,#1e3ex0","netMap":"(32)4000:#1ebcx0,#7x7,#77x0,#3x7,#8x0,#2x3,#75x0,#2x7,#3x0,#2x2,#3x0,#2x3,#3x0,#3x5,#72x0,#2x2,#8x0,#4x5,#6ex0,#2x6,#3x0,#2x2,#3x0,#2x4,#3x0,#3x5,#6cx0,#3x6,#8x0,#2x4,#75x0,#7x6,#1e3dx0","gates":"(32)10000:#2x0,70006,70002,20006,30004,0,10001,#fff8x0","netCharges":"(32)10000:0,#3xffffffff,0,#2xffffffff,0,#fff8xffffffff","memoryTree":"(32)8:#8x1"};
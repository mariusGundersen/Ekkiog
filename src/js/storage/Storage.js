const PATH = 'ekkiog[0.0.3].save';

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

const DEFAULT = {"width":128,"height":128,"map":"(32)4000:#1fbax0,#6x1,#79x0,4,1,#8x0,2,1,#75x0,1,#4x0,1,#4x0,1,#4x0,#3x1,#72x0,2,1,#8x0,2,#3x1,#6ex0,1,#4x0,1,#4x0,1,#4x0,#3x1,#6dx0,4,1,#8x0,2,1,#75x0,#6x1,#1d40x0","netMap":"(32)4000:#1fbax0,#7x6,#77x0,#3x6,#8x0,#2x3,#75x0,#2x6,#3x0,#2x2,#3x0,#2x3,#3x0,#3x5,#72x0,#2x2,#8x0,#4x5,#6ex0,#2x7,#3x0,#2x2,#3x0,#2x4,#3x0,#3x5,#6cx0,#3x7,#8x0,#2x4,#75x0,#7x7,#1d3fx0","gates":"(32)10000:#2x0,60007,60002,20007,30004,#fffax0","netCharges":"(32)10000:0,#4xffffffff,#3x0,#fff8xffffffff"};
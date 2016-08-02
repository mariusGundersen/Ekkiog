const PATH = 'ekkiog[0.0.2].save';

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

const DEFAULT = {"width":128,"height":128,"map":"(32)4000:#1c2bx0,#fx1,#71x0,1,#dx0,#2x1,#70x0,1,#4x0,1,#4x0,1,#4x0,1,#4x0,#2x1,#6ax0,1,#3x0,2,1,#3x0,2,1,#3x0,2,#6x1,#4x0,2,1,#65x0,1,#4x0,1,#4x0,1,#5x0,1,#4x0,1,#4x0,1,#4x0,#3x1,#72x0,2,1,#8x0,2,#3x1,#54x0,1,#4x0,1,#4x0,1,#4x0,1,#4x0,1,#5x0,1,#4x0,1,#4x0,1,#4x0,#3x1,#54x0,1,#3x0,2,1,#3x0,2,1,#3x0,2,1,#3x0,2,1,#3x0,2,#6x1,#4x0,2,1,#5bx0,1,#4x0,1,#4x0,1,#4x0,1,#4x0,1,#4x0,1,#4x0,#2x1,#60x0,1,#17x0,#2x1,#66x0,#19x1,#1ec6x0","netMap":"(32)4000:#1c2bx0,#fx7,#71x0,7,#dx0,#2x7,#70x0,#2x7,#3x0,#2xb,#3x0,#2x9,#3x0,7,#4x0,#3x7,#69x0,7,#3x0,#2xb,#3x0,#2x9,#3x0,#7x7,#4x0,#2x3,#65x0,#2x7,#3x0,#2xb,#3x0,#2x9,#4x0,#2x7,#3x0,#2x2,#3x0,#2x3,#3x0,#3x5,#72x0,#2x2,#8x0,#4x5,#54x0,#2x6,#3x0,#2xd,#3x0,#2xc,#3x0,#2xa,#3x0,#2x8,#4x0,#2x6,#3x0,#2x2,#3x0,#2x4,#3x0,#3x5,#54x0,6,#3x0,#2xd,#3x0,#2xc,#3x0,#2xa,#3x0,#2x8,#3x0,#7x6,#4x0,#2x4,#5bx0,#2x6,#3x0,#2xd,#3x0,#2xc,#3x0,#2xa,#3x0,#2x8,#3x0,6,#4x0,#3x6,#5fx0,6,#17x0,#2x6,#66x0,#19x6,#1ec6x0","gates":"(32)10000:#2x0,60007,20007,60002,40003,80008,90009,a000a,b000b,c000c,70007,d000d,60006,#f2x0,3,#ffx0,3,#ffx0,3,#ffx0,3,#ffx0,3,#ffx0,3,#f9ffx0","netCharges":"(32)10000:0,ffffffff,#3x0,#3xffffffff,#4x0,ffffffff,0,#fff2xffffffff"};
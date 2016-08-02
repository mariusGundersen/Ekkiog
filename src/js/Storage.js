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

const DEFAULT = {"width":128,"height":128,"map":"10000:#66d0x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#1d7x0,1,#27x0,1,#3x0,1,#1d3x0,1,#13x0,1,#17x0,1,#3x0,1,#1cfx0,1,#fx0,2,#3x0,1,#fx0,2,#3x0,1,#7x0,1,#1cfx0,1,#13x0,1,#13x0,1,#7x0,1,#1f3x0,1,#3x0,1,#7x0,1,#1bfx0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#bx0,1,#1bfx0,1,#3fx0,1,#1bfx0,1,#13x0,1,#13x0,1,#17x0,1,#1bfx0,1,#fx0,2,#3x0,1,#fx0,2,#3x0,1,#fx0,2,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#1abx0,1,#13x0,1,#13x0,1,#17x0,1,#23x0,2,#3x0,1,#1d7x0,1,#13x0,1,#13x0,1,#17x0,1,#3x0,1,#3x0,1,#1c7x0,2,#3x0,1,#23x0,2,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#1b7x0,1,#13x0,1,#13x0,1,#17x0,1,#3x0,1,#3x0,1,#177x0,1,#13x0,1,#13x0,1,#17x0,1,#23x0,2,#3x0,1,#197x0,1,#fx0,2,#3x0,1,#fx0,2,#3x0,1,#fx0,2,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#1abx0,1,#13x0,1,#13x0,1,#17x0,1,#1bfx0,1,#3fx0,1,#1bfx0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#bx0,1,#1f3x0,1,#3x0,1,#7x0,1,#1cfx0,1,#13x0,1,#13x0,1,#7x0,1,#1cfx0,1,#fx0,2,#3x0,1,#fx0,2,#3x0,1,#7x0,1,#1cfx0,1,#13x0,1,#17x0,1,#3x0,1,#1cfx0,1,#27x0,1,#3x0,1,#1d3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#3x0,1,#6907x0","netMap":"10000:#66d0x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#1d7x0,7,#27x0,7,#3x0,7,#1d3x0,7,#3x0,7,#fx0,e,#3x0,e,#13x0,7,#3x0,7,#1cfx0,7,#fx0,e,#3x0,e,#fx0,c,#3x0,c,#7x0,7,#1cfx0,7,#3x0,7,#fx0,e,#3x0,e,#fx0,c,#7x0,7,#1f3x0,c,#3x0,c,#7x0,7,#1bfx0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#3x0,c,#bx0,7,#1bfx0,c,#3fx0,7,#1bfx0,c,#3x0,c,#fx0,a,#3x0,a,#fx0,9,#3x0,9,#13x0,7,#1bfx0,c,#fx0,a,#3x0,a,#fx0,9,#3x0,9,#fx0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#3x0,7,#1a7x0,c,#3x0,c,#fx0,a,#3x0,a,#fx0,9,#3x0,9,#13x0,7,#23x0,4,#3x0,4,#1d7x0,7,#3x0,7,#fx0,2,#3x0,2,#fx0,4,#3x0,4,#13x0,5,#3x0,5,#3x0,5,#1c7x0,2,#3x0,2,#23x0,5,#3x0,5,#3x0,5,#3x0,5,#3x0,5,#1b7x0,6,#3x0,6,#fx0,2,#3x0,2,#fx0,3,#3x0,3,#13x0,5,#3x0,5,#3x0,5,#177x0,d,#3x0,d,#fx0,b,#3x0,b,#fx0,8,#3x0,8,#13x0,6,#23x0,3,#3x0,3,#197x0,d,#fx0,b,#3x0,b,#fx0,8,#3x0,8,#fx0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#1a7x0,d,#3x0,d,#fx0,b,#3x0,b,#fx0,8,#3x0,8,#13x0,6,#1bfx0,d,#3fx0,6,#1bfx0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#3x0,d,#bx0,6,#1f3x0,d,#3x0,d,#7x0,6,#1cfx0,6,#3x0,6,#fx0,f,#3x0,f,#fx0,d,#7x0,6,#1cfx0,6,#fx0,f,#3x0,f,#fx0,d,#3x0,d,#7x0,6,#1cfx0,6,#3x0,6,#fx0,f,#3x0,f,#13x0,6,#3x0,6,#1cfx0,6,#27x0,6,#3x0,6,#1d3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#3x0,6,#6907x0","gates":"40000:#8x0,7,0,6,0,2,0,6,0,7,0,2,0,4,0,3,0,8,0,8,0,9,0,9,0,b,0,b,0,a,0,a,0,c,0,c,0,d,0,d,0,e,0,e,0,f,0,f,0,7,0,7,0,6,0,6,#3c1x0,3,#7ffx0,3,#27ffx0,3,#3cbffx0","netCharges":"40000:#4x0,#cxff,#4x0,#cxff,#cx0,#8xff,#8x0,#3ffc4xff"};
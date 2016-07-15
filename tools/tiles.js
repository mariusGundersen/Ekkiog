const TILE = 16;
const SIDE = 8;

const SIDES = [
  {x:  0, y:  0, i:0},
  {x:  0, y: -1, i:1},
  {x:  1, y:  0, i:2},
  {x:  0, y:  1, i:4},
  {x: -1, y:  0, i:8}
]

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.strokeStyle = "2px black";
ctx.lineWidth = 1.5;
ctx.lineCap = 'round';
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, TILE*4, TILE*4);
ctx.translate(SIDE, SIDE);

for(let y=0; y<4; y++){
  for(let x=0; x<4; x++){
    const index = y*4 + x;
    const edges = [];

    for(let t=0; t<4; t++){
      if((index>>t)&1 == 1){
        edges.push(SIDES[t+1]);
      }
    }

    if(edges.length == 1){
      edges.push(SIDES[0]);
    }

    let lines = [];
    for(const f of edges){
      for(const t of edges.filter((e, i) => i<edges.indexOf(f))){
        lines.push({
          f: f,
          t: t
        });
      }
    }

    if(edges.length == 3){
      lines = lines.filter(l => (l.f.i + l.t.i)%5 > 0);
    }

    if(edges.length > 3){
      lines = lines.filter(l => (l.f.i + l.t.i)%5 == 0);
    }

    ctx.save();
    ctx.translate(x*TILE, y*TILE);
    ctx.moveTo(-SIDE, -SIDE);
    ctx.lineTo(-SIDE, TILE);
    ctx.lineTo(TILE, TILE);
    ctx.lineTo(TILE, -SIDE);
    ctx.clip();
    ctx.beginPath();
    for(const line of lines){
      ctx.moveTo(line.f.x*SIDE, line.f.y*SIDE);
      ctx.lineTo(line.t.x*SIDE, line.t.y*SIDE);
    }
    ctx.stroke();
    ctx.restore();
  }
}
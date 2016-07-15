const TILE = 64;
const SIDE = TILE/2;

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
ctx.lineWidth = 10;
ctx.lineCap = 'square';
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

for(let y=0; y<4; y++){
  for(let x=0; x<4; x++){
    ctx.save();
    ctx.translate(SIDE + x*TILE, SIDE + y*TILE);
    ctx.beginPath();
    ctx.ellipse(0, 0, SIDE/4, SIDE/4, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#eee';
    ctx.fill();
    ctx.restore();
  }
}

ctx.translate(4*TILE + SIDE, SIDE);
ctx.save();
ctx.beginPath();
ctx.ellipse(0, 0, SIDE/4, SIDE/4, 0, 0, 2 * Math.PI);
ctx.fillStyle = '#000';
ctx.fill();
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
        lines.push({
          f: SIDES[0],
          t: f,
          d: false,
          s: f.i == 0
        });
    }

    if(edges.length == 3){
      lines = lines.filter(l => !l.d || l.s);
    }

    if(edges.length > 3){
      lines = lines.filter(l => !l.d);
    }

    ctx.save();
    ctx.translate(x*TILE, y*TILE);
    ctx.beginPath();
    //ctx.translate(0.5, 0.5);
    ctx.moveTo(-SIDE, -SIDE);
    ctx.lineTo(-SIDE, SIDE);
    ctx.lineTo(SIDE, SIDE);
    ctx.lineTo(SIDE, -SIDE);
    //(x%2)^(y%2) && ctx.fill();
    ctx.clip();
    //ctx.translate(-0.5, -0.5);
    ctx.beginPath();
    for(const line of lines){
      console.log(line);
      ctx.lineWidth = line.d ? 10/Math.SQRT2 : 10;
      ctx.lineCap = !line.d || line.s ? 'round' : 'square';
      ctx.moveTo(line.f.x*SIDE, line.f.y*SIDE);
      ctx.lineTo(line.t.x*SIDE, line.t.y*SIDE);
    }
    ctx.stroke();
    ctx.restore();
  }
}
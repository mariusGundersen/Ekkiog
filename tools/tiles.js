const TILE = 16;
const SIDE = TILE/2;

const GRID_COLOR = "#F0F";

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
ctx.mozImageSmoothingEnabled = false;
ctx.strokeStyle = GRID_COLOR;
ctx.lineWidth = 2;
ctx.lineCap = 'square';
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.save();
ctx.translate(SIDE, SIDE);
ctx.beginPath();
ctx.rect(-1, -1, 2, 2);
ctx.fillStyle = '#eee';
ctx.fill();
ctx.restore();

ctx.save();
ctx.translate(TILE + SIDE, SIDE);
ctx.beginPath();
ctx.rect(-1, -1, 2, 2);
//ctx.ellipse(0, 0, SIDE/4, SIDE/4, 0, 0, 2 * Math.PI);
ctx.fillStyle = GRID_COLOR;
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
      ctx.lineWidth = 2;
      ctx.lineCap = 'square';
      ctx.moveTo(line.f.x*SIDE, line.f.y*SIDE);
      ctx.lineTo(line.t.x*SIDE, line.t.y*SIDE);
    }
    ctx.stroke();
    ctx.restore();
  }
}
ctx.restore();

ctx.save();
ctx.translate(0, TILE*4);


ctx.beginPath();
ctx.strokeStyle = GRID_COLOR;
ctx.moveTo(0, SIDE);
ctx.lineTo(SIDE, SIDE);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = GRID_COLOR;
ctx.moveTo(0, TILE*2 + SIDE);
ctx.lineTo(SIDE, TILE*2 + SIDE);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = GRID_COLOR;
ctx.moveTo(TILE*3 + TILE, TILE + SIDE);
ctx.lineTo(TILE*3 + SIDE, TILE + SIDE);
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = "#000";
ctx.moveTo(SIDE, SIDE/2);
ctx.lineTo(SIDE, TILE*2 + SIDE*3/2);

ctx.arc(TILE + SIDE*7/6, TILE + SIDE, TILE + SIDE/2, Math.PI/2, 0, true);
ctx.arc(TILE*2 + SIDE*2 + SIDE/4, TILE + SIDE, SIDE/2, Math.PI, Math.PI*2, true);
ctx.arc(TILE*2 + SIDE*2 + SIDE/4, TILE + SIDE, SIDE/2, Math.PI*2, Math.PI, true);
ctx.arc(TILE + SIDE*7/6, TILE + SIDE, TILE + SIDE/2, 0, Math.PI*3/2, true);

ctx.lineTo(SIDE, SIDE/2);
ctx.stroke();



ctx.restore();
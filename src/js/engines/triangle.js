import Triangle from 'gl-big-triangle';

let triangle;

export function initialize(gl){
  triangle = new Triangle(gl);
  bind();
}

export function bind(){
  triangle.bind();
}

export function draw(){
  triangle.draw();
}

export function unbind(){
  triangle.unbind();
}
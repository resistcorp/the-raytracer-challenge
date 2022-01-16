import Tuples from "../src/tuples.js";
import Canvas from "../src/canvas.js";

function isNode(){
  return !isHTML();
}
function isHTML(){
  try{
    return window && document;
  }catch(e){}
  return false;
}
export function play(){
  const $ = id => + document.getElementById(id).value;

  let projectile = {
    position: Tuples.makePoint(0, 0, 0),
    velocity: Tuples.makeVector($("velX"), $("velY"), 0),
  };
  let environment = {
    gravity: Tuples.makeVector(0, -$('gravity'), 0),
    wind: Tuples.makeVector($('wind'), 0, 0),
  };
  computeCanvas(
    $("width"), $("height"),
    projectile, environment
  )
  return false;
}

function main(){
  let projectile = {
    position: Tuples.makePoint(0, 0, 0),
    velocity: Tuples.makeVector(10, 10, 0),
  };
  let environment = {
    gravity: Tuples.makeVector(0, -0.15, 0),
    wind: Tuples.makeVector(-0.12, 0, 0),
  };
  computeCanvas(
    700, 350,
    projectile, environment
  )
}
function computeCanvas(width, height, projectile, environment){
  console.log(projectile);
  let turns = 0;
  let maxY = 0;
  let cnv = Canvas.create(width, height);
  while(projectile.position.y >= 0.0 && turns <  width * height){
    tick(environment, projectile);
    let {x, y} = projectile.position;
    maxY = Math.max(maxY, y);
    Canvas.writePixel(cnv, x|0, cnv.height-y|0, Canvas.makeColor(1.0, 0.0, 0.0, 1.0));
    turns++;
  }
  
  console.log(`finished after ${turns} turns. max y reached ${maxY}`);
  console.log(projectile);
  save(cnv);
}
async function save(cnv){
  if(isNode()){
    let ppm = Canvas.toPPM(cnv);
    let fs = await import('fs');
    fs.writeFileSync("image.ppm", ppm);
  }
  if(isHTML()){
    let destCnv = document.getElementById("cnv");
    let {width, height} = cnv;
    destCnv.width = width;
    destCnv.height = height;
    let ctx = destCnv.getContext("2d");
    // let imageData = ctx.getImageData(0, 0, width, height);
    let imageData = new ImageData(width, height);
    Canvas.populateImageData(cnv, imageData.data);
    ctx.putImageData(imageData, 0, 0);
  }
}
function tick(world, proj){
  //TODO : maybe return a new projectile
  proj.position = Tuples.add(proj.velocity, proj.position);
  let worldVector = Tuples.add(world.gravity, world.wind);
  proj.velocity = Tuples.add(proj.velocity, worldVector);
}
main();
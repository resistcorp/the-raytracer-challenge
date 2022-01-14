import Tuples from "../src/tuples.js";
import Canvas from "../src/canvas.js";

import fs from 'fs';

function main(){
  let projectile = {
    position : Tuples.makePoint(0,0,0),
    velocity : Tuples.makeVector(10,10,0),
  };
  let environment = {
    gravity : Tuples.makeVector(0,-0.15,0),
    wind : Tuples.makeVector(-0.05, 0, 0),
  };
  console.log(projectile);
  let turns = 0;
  let maxY = 0;
  let cnv = Canvas.create(700, 350);
  while(projectile.position.y >= 0.0){
    tick(environment, projectile);
    console.log(projectile);
    let {x, y} = projectile.position;
    maxY = Math.max(maxY, y);
    Canvas.writePixel(cnv, x|0, 350-y|0, Canvas.makeColor(1.0, 0.0, 0.0));
    turns++;
  }
  let ppm = Canvas.toPPM(cnv);
  fs.writeFileSync("image.ppm", ppm);
  console.log(`finished after ${turns} turns. max y reached ${maxY}`);
}
function tick(world, proj){
  //TODO : maybe return a new projectile
  proj.position = Tuples.add(proj.velocity, proj.position);
  let worldVector = Tuples.add(world.gravity, world.wind);
  proj.velocity = Tuples.add(proj.velocity, worldVector);
}
main();
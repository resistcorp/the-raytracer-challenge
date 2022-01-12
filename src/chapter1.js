import Tuples from "./tuples.js"

function main(){
  let projectile = {
    position : Tuples.makePoint(0,1,0),
    velocity : Tuples.normalize(Tuples.makeVector(1,1,0)),
  };
  let evironment = {
    gravity : Tuples.makeVector(0,-0.1,0),
    wind : Tuples.makeVector(-0.01, 0, 0),
  };
  console.log(projectile);
  let turns = 0;
  while(projectile.position.y > 0.0){
    tick(evironment, projectile);
    console.log(projectile);
    turns++;
  }
  console.log(`finished after ${turns} turns`);
}
function tick(world, proj){
  //TODO : maybe return a new projectile
  proj.position = Tuples.add(proj.velocity, proj.position);
  let worldVector = Tuples.add(world.gravity, world.wind);
  proj.velocity = Tuples.add(proj.velocity, worldVector);
}
main();
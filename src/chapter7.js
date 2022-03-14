import { createColor } from "./canvas.js";
import { drawCanvas } from "./htmlLib.js";
import { material, pointLight } from "./lighting.js";
import { rotation_y, scaling, translation } from "./matrices.js";
import { sphere } from "./primitives.js";
import { createWorld } from "./scene.js";
import { createPoint, createVector } from "./tuples.js";
import { createCamera } from "./view.js";

let isAnimating = false;
const TURNS_PER_SEC = 0.2;
export function drawScene(time = 0){
  const world = createWorld();
  const mtl1 = material({color : createColor(0.1, 0.9, 0.2)});
  const mtl2 = material({color : createColor(0.6, 0.5, 0.2)});
  const mtl3 = material({color : createColor(0.7, 0.7, 0.1)});
  world.addLight(pointLight(createPoint(-10, 3, -5), createColor(1, 1, 1)));

  world.addObject(sphere(translation(0, 1, 0), mtl1));
  world.addObject(sphere(translation(0, 0.1, 1.5).mul(scaling(0.7, 0.3, 0.7)), mtl3));
  world.addObject(sphere(translation(-1, 0.3, 0.5).mul(scaling(0.3, 0.3, 0.3)), mtl2));

  world.addObject(sphere(translation(0, 0, -2).mul(scaling(5, 5, 0.001))), material({ color: createColor(0.1, 0.1, 0.1) }));
  world.addObject(sphere(translation(0, 0, 0).mul(scaling(5, 0.001, 5))), material({ color: createColor(0.8, 0.8, 0.8) }));
  world.addObject(sphere(translation(3, 0, 0).mul(scaling(0.001, 5, 5))), material({ color: createColor(0.8, 0.8, 0.5) }));

  // const camera = createCamera(400, 250, Math.PI/2);
  const camera = createCamera(800, 500, Math.PI/2);
  const cameraPosition = rotation_y(Math.PI * 2 * time + TURNS_PER_SEC).transform(createPoint(-3, 2, 2.5));
  // const cameraPosition = createPoint(-3, 2, 1);
  camera.lookAt(cameraPosition, createPoint(0, 0, 1), createVector(0, 1, 0));

  const cnv = camera.render(world);
  drawCanvas(cnv);
}


export function animateScene(shouldAnimate) {
  isAnimating = shouldAnimate;
}
function frame(time){
  if(isAnimating)
    drawScene(time)
  requestAnimationFrame(frame);
}

frame(0);
import { createColor } from "./canvas.js";
import { drawCanvas } from "./htmlLib.js";
import { material, pointLight } from "./lighting.js";
import { rotation_y, scaling, translation } from "./matrices.js";
import { plane, sphere } from "./primitives.js";
import { createWorld } from "./scene.js";
import { createPoint, createVector } from "./tuples.js";
import { createCamera } from "./view.js";

let isAnimating = false;
export function drawScene(fullRes = false, timeInSeconds = 0){
  const world = createWorld();
  world.tryAmbient = !!document.getElementById("ambientOcclusion").checked;
  const usePlanes =  !!document.getElementById("usePlanes").checked;

  const mtl1 = material({color : createColor(0.1, 0.9, 0.2)});
  const mtl2 = material({color : createColor(0.6, 0.5, 0.2)});
  const mtl3 = material({color : createColor(0.7, 0.7, 0.1)});
  world.addLight(pointLight(createPoint(-10, 3, -5), createColor(1, 1, 1)));

  world.addObject(sphere(translation(0, 1, 0), mtl1));
  world.addObject(sphere(translation(0, 0.1, 1.5).mul(scaling(0.7, 0.3, 0.7)), mtl3));
  world.addObject(sphere(translation(-1, 0.3, 0.5).mul(scaling(0.3, 0.3, 0.3)), mtl2));

  if(usePlanes){
    world.addObject(plane().setMaterial(material({ color: createColor(0.5, 0.5, 0.8) })));
  }else{
    world.addObject(sphere(translation(0, 0, -2).mul(scaling(5, 5, 0.001)), material({ color: createColor(0.9, 0.7, 0.7) })));
    world.addObject(sphere(translation(0, 0, 0).mul(scaling(2, 0.1, 2)), material({ color: createColor(0.5, 0.5, 0.8) })));
    world.addObject(sphere(translation(3, 0, 0).mul(scaling(0.001, 5, 5)), material({ color: createColor(0.8, 0.8, 0.5) })));
  }

  // const camera = createCamera(400, 250, Math.PI/2);

  const dims = fullRes ? { w: 800, h: 500 } : { w: 200, h: 125 };

  const camera = createCamera(dims.w, dims.h, Math.PI/2);
  let rotation = 0;
  if(isAnimating){
    let turnsPerSec = +document.getElementById("turnsPerSec").value;
    if (isNaN(turnsPerSec)) {
      turnsPerSec = 0.05;
    }
    rotation = Math.PI * 2 * timeInSeconds * turnsPerSec;
  }

  const cameraPosition = rotation_y(rotation).transform(createPoint(-3, 2, 2.5));
  // const cameraPosition = createPoint(-3, 2, 1);
  camera.lookAt(cameraPosition, createPoint(0, 0, 1), createVector(0, 1, 0));

  const cnv = camera.render(world);
  drawCanvas(cnv);

  document.getElementById("cnv").classList = fullRes ? ["highRes"] : ["lowRes"];
}


export function animateScene(shouldAnimate) {
  isAnimating = shouldAnimate;
}
function frame(time){
  if(isAnimating)
    drawScene(false, time / 1000.0)
  requestAnimationFrame(frame);
}

frame(0);
import { createColor } from "./canvas.js";
import { drawCanvas } from "./htmlLib.js";
import { material, pointLight } from "./lighting.js";
import { rotation_y, scaling, translation } from "./matrices.js";
import { plane, sphere } from "./primitives.js";
import { createWorld } from "./scene.js";
import { createPoint, createVector } from "./tuples.js";
import { createCamera } from "./view.js";

let isAnimating = false;
let nextSample = 0;
const NUM_SAMPLES = 100;
let samplesRender = Array(NUM_SAMPLES).map(_=>1000.0);
let samplesPresent = Array(NUM_SAMPLES).map(_=>1000.0);
const $ = document.getElementById.bind(document);

let lastFrameTime = 0;
let rotation = 0;

export function drawScene(fullRes = false){
  const startTime = performance.now();
  const world = createWorld();
  world.tryAmbient = !!$("ambientOcclusion").checked;
  const usePlanes =  !!$("usePlanes").checked;

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

  const cameraPosition = rotation_y(rotation).transform(createPoint(-3, 2, 2.5));
  // const cameraPosition = createPoint(-3, 2, 1);
  camera.lookAt(cameraPosition, createPoint(0, 0, 1), createVector(0, 1, 0));

  const cnv = camera.render(world);
  const renderTime = performance.now();

  drawCanvas(cnv);
  const presentTime = performance.now();

  $("cnv").classList = fullRes ? ["highRes"] : ["lowRes"];

  samplesRender[nextSample % NUM_SAMPLES] = renderTime - startTime;
  samplesPresent[nextSample % NUM_SAMPLES] = presentTime - renderTime;
  nextSample ++;
}

export function resetCounters() {
  nextSample = 0;
}
export function animateScene(shouldAnimate) {
  isAnimating = shouldAnimate;
}
function frame(time){
  if(isAnimating){
    const timeInSeconds = (time - lastFrameTime) / 1000.0
    if (isAnimating) {
      let turnsPerSec = +$("turnsPerSec").value;
      if (isNaN(turnsPerSec)) {
        turnsPerSec = 0.05;
      }
      rotation += Math.PI * 2 * timeInSeconds * turnsPerSec;
    }

    drawScene(false, time / 1000.0);
  }
  lastFrameTime = time;

  const samples = Math.min(nextSample, NUM_SAMPLES);
  if(samples){
    let renderTotal = 0;
    let presentTotal = 0;

    for(let i = 0; i < samples; i++){
      renderTotal += samplesRender[i];
      presentTotal += samplesPresent[i];
    }

    const avgRender = renderTotal / samples;
    const avgPresent = presentTotal / samples;

    const avg = (renderTotal + presentTotal) / samples;
    const fps = 1000 / avg;

    console.log("averages :", avg, avgRender, avgPresent, "fps", fps);

    $("avg").innerText = avg.toFixed(0);
    $("fps").innerText = fps.toFixed(2);
  }else{
    $("avg").innerText = "NaN";
    $("fps").innerText = "NaN";
  }
  
  requestAnimationFrame(frame);
}

frame(0);
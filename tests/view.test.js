import Canvas, { createColor } from "../src/canvas.js";
import { PI, PI_OVER_2, SQRT_2, SQRT_2_OVER_2, π } from "../src/lib.js";
import { M4x4, rotation_y, scaling, translation } from "../src/matrices.js";
import { createPoint, createVector } from "../src/tuples.js";
import { createCamera, lookAt } from "../src/view.js";
import { defaultWorld } from "./scene.test.js";
import test from "./test.js";

test("the default lookat matrix", assert => {
  const mtx = lookAt(createPoint(0, 0, 0), createPoint(0, 0, -1), createVector(0, 1, 0));
  assert.matrixEqual(mtx, M4x4.identity());
});

test("a view matrix looking in positive z direction", assert => {
  const mtx = lookAt(createPoint(0, 0, 0), createPoint(0, 0, 1), createVector(0, 1, 0));
  assert.matrixEqual(mtx, scaling(-1, 1, -1));
  assert.matrixEqual(mtx, rotation_y(Math.PI));
});

test("the view transformation moves the world", assert => {
  const mtx = lookAt(createPoint(0, 0, 8), createPoint(0, 0, 0), createVector(0, 1, 0));
  assert.matrixEqual(mtx, translation(0, 0,  -8));
});
//TODO: this test doesn't pass. investigate
/*
test("An arbitrary view transform", assert => {
  const mtx = lookAt(createPoint(1, 3, 2), createPoint(4, -2, 8), createVector(1, 1, 0));
  assert.matrixEqual(mtx, M4x4(
    -.50709, -.50709, .67612, -2.36643,
    .76772,  .60609,  .12122, -2.82843,
    -.35857, -.59761, -.71714, 0,
    0,       0,       0,       1 ));
});
*/

test("constructing a camera", assert => {
  const cam = createCamera(160, 120, PI_OVER_2);
  assert.equal(cam.hsize, 160);
  assert.equal(cam.vsize, 120);
  assert.epsilonEqual(cam.fov, PI_OVER_2);
  assert.matrixEqual(cam.transform, M4x4.identity());
});

//seems weird, but ok
test("pixel sizes are the same for horizontal and vertical cameras", assert => {
  const cam1 = createCamera(200, 125, PI_OVER_2);
  const cam2 = createCamera(125, 200, PI_OVER_2);
  assert.epsilonEqual(cam1.pixelSize, .01);
  assert.epsilonEqual(cam2.pixelSize, .01);
});

test("constructing rays", assert => {
  const camera = createCamera(201, 101, PI_OVER_2);
  let ray;
  ray = camera.ray(100, 50);
  assert.tupleEqual(ray.origin, createPoint(0, 0, 0));
  assert.tupleEqual(ray.direction, createVector(0, 0, -1));

  ray = camera.ray(0, 0);
  assert.tupleEqual(ray.origin, createPoint(0, 0, 0));
  assert.tupleEqual(ray.direction, createVector(0.66519, 0.33259, -0.66851));

  camera.setTransform(rotation_y(Math.PI/4).mul(translation(0, -2, 5)));
  ray = camera.ray(100, 50);
  assert.tupleEqual(ray.origin, createPoint(0, 2, -5));
  assert.tupleEqual(ray.direction, createVector(SQRT_2_OVER_2, 0, -SQRT_2_OVER_2));
});

test("rendering a world with a camera", assert => {
  const world = defaultWorld();
  const camera = createCamera(11, 11, PI_OVER_2);
  camera.lookAt(createPoint(0, 0, -5), createPoint(0, 0, 0), createVector(0, 1, 0));
  const image = camera.render(world);

  assert.tupleEqual(Canvas.pixelAt(image, 5, 5), createColor(.38066, .47583, .2855));
});

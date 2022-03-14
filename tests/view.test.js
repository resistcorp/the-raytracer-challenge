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

test("An arbitrary view transform", assert => {
  const mtx = lookAt(createPoint(1, 3, 2), createPoint(4, -2, 8), createVector(1, 1, 0));
  //TODO: this test doeasn't pass. investigate
  assert.matrixEqual(mtx, M4x4(
    -.50709, -.50709, .67612, -2.36643,
    .76772,  .60609,  .12122, -2.82843,
    -.35857, -.59761, -.71714, 0,
    0,       0,       0,       1 ));
});

const PIOVERTWO = Math.PI / 2;
const SQRT2OVERTWO = Math.SQRT2 / 2;
test("constructing a camera", assert => {
  const cam = createCamera(160, 120, PIOVERTWO);
  assert.equal(cam.hsize, 160);
  assert.equal(cam.vsize, 120);
  assert.epsilonEqual(cam.fov, PIOVERTWO);
  assert.matrixEqual(cam.transform, M4x4.identity());
});

//seems weird, but ok
test("pixel sizes are the same for horizontal and vertical cameras", assert => {
  const cam1 = createCamera(200, 125, PIOVERTWO);
  const cam2 = createCamera(125, 200, PIOVERTWO);
  assert.epsilonEqual(cam1.pixelSize, .01);
  assert.epsilonEqual(cam2.pixelSize, .01);
});

test("constructing rays", assert => {
  const camera = createCamera(201, 101, PIOVERTWO);
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
  assert.tupleEqual(ray.direction, createVector(SQRT2OVERTWO, 0, -SQRT2OVERTWO));
});

test("rendering a world with a camera", assert => {
  const world = defaultWorld();
  const camera = createCamera(11, 11, PIOVERTWO);
  camera.lookAt(createPoint(0, 0, -5), createPoint(0, 0, 0), createVector(0, 1, 0));
  const image = camera.render(world);

  assert.tupleEqual(image.pixelAt(5, 5), makeColor(.38066, .47583, .2855));
});

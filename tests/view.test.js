import { M4x4, rotation_y, scaling, translation } from "../src/matrices.js";
import { createPoint, createVector } from "../src/tuples.js";
import { defaultWorld } from "./scene.test.js";
import test from "./test.js";

test("the default lookat matrix", assert => {
  const mtx = lookAt(createPoint(0, 0, 0), createPoint(0, 0, -1), createVector(0, 1, 0));
  assert.matrixEqual(mtx, M4x4.identity());
});

test("a view matrix looking in positive z direction", assert => {
  const mtx = lookAt(createPoint(0, 0, 0), createPoint(0, 0, 1), createVector(0, 1, 0));
  assert.matrixEqual(mtx, scaling(-1, 0, -1));
  assert.matrixEqual(mtx, rotation_y(Math.PI));
});

test("the view transformation moves the world", assert => {
  const mtx = lookAt(createPoint(0, 0, 8), createPoint(0, 0, 0), createVector(0, 1, 0));
  assert.matrixEqual(mtx, translation(0, 0, -8));
});

test("the view transformation moves the world", assert => {
  const mtx = lookAt(createPoint(1, 3, 2), createPoint(4, -2, 8), createVector(1, 1, 0));
  assert.matrixEqual(mtx, M4x4(
    -.50709, -.50709, .67612, -2.36643,
    .76772,  .60609,  .12122, -2.82843,
    -.35857, -.59761, -.71714, 0,
    0,       0,       0,       1 ));
});

test("constructing a camera", assert => {
  const cam = makeCamera(160, 120, PIOVERTWO);
  assert.equals(cam.hsize, 160);
  assert.equals(cam.vsize, 120);
  assert.equals(cam.fov, PIOVERTWO);
  assert.equals(cam.transform, M4x4.identity());
});

//seems weird, but ok
test("pixel sizes are the same for horizontal and vertical cameras", assert => {
  const cam1 = makeCamera(200, 125, PIOVERTWO);
  const cam2 = makeCamera(125, 200, PIOVERTWO);
  assert.equals(cam1.pixelSize, .01);
  assert.equals(cam2.pixelSize, .01);
});

test("constructing rays", assert => {
  const camera = makeCamera(201, 101, PIOVERTWO);
  let ray;
  ray = camera.ray(100, 50);
  assert.equals(ray.origin, makePoint(0, 0, 0));
  assert.equals(ray.direction, makeVector(0, 0, -1));

  ray = camera.ray(0, 0);
  assert.equals(ray.origin, makePoint(0, 0, 0));
  assert.equals(ray.direction, makeVector(0.66519, 0.33259, -0.66851));

  camera.transform = rotation_y(Math.PI/4).mul(translation(0, -2, 5))
  ray = camera.ray(0, 0);
  assert.equals(ray.origin, makePoint(0, 2, -5));
  assert.equals(ray.direction, makeVector(PIOVERTWO, 0, -PIOVERTWO));
});

const PIOVERTWO = Math.PI / 2;
test("rendering a world with a camera", assert => {
  const world = defaultWorld();
  const camera = makeCamera(11, 11, PIOVERTWO);
  camera.lookAt(makePoint(0, 0, -5), makePoint(0, 0, 0), makeVector(0, 1, 0));
  const image = camera.render(w);

  assert.tupleEqual(image.pixelAt(5, 5), makeColor(.38066, .47583, .2855));
});

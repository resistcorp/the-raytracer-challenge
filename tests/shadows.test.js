import { createColor } from "../src/canvas.js";
import { EPSILON, intersection } from "../src/lib.js";
import { lighting, material, pointLight } from "../src/lighting.js";
import { translation } from "../src/matrices.js";
import { sphere } from "../src/primitives.js";
import { createRay } from "../src/rays.js";
import { createWorld } from "../src/scene.js";
import { createPoint, createVector } from "../src/tuples.js";
import { defaultWorld } from "./scene.test.js";

test("Lighting with the surface in shadow", assert => {
  const light = pointLight(createPoint(0,0,-10), createColor(1,1,1));
  const eyev = createVector(0,0,-1);
  const normalv = createVector(0,0,-1);
  //FIXME: shadow last param
  const result = lighting(material(), light, createPoint(0,0,0), eyev, normalv, true);

  assert.tupleEqual(result, createColor(0.1, 0.1, 0.1));
});

test("no shadow if nothing aligns", assert => {
  const w = defaultWorld();
  const p = createPoint(0, 10, 0);

  //FIXME: assert.false dosn't exist yet
  assert.false(w.isInShadow(p));
});

test("shadow if there's an object between point and light", assert => {
  const w = defaultWorld();
  const p = createPoint(10, -10, 10);

  //FIXME: assert.true doesn't exist yet
  assert.true(w.isInShadow(p));
});

test("no shadow if the point is behind light", assert => {
  const w = defaultWorld();
  const p = createPoint(-20, 20, -20);

  assert.false(w.isInShadow(p));
});

test("no shadow if the point is between light and objects", assert => {
  const w = defaultWorld();
  const p = createPoint(-2, 2, -2);

  assert.false(w.isInShadow(p));
});

test("shadeHit does test for shadows", assert => {
  const w = createWorld();
  w.addLight(pointLight(createPoint(0, 0, -10), createColor(1.0, 1.0, 1.0)));
  w.addObject(sphere());
  const s2 = sphere(material(), translation(0, 0, 10));
  w.addObject(s2);

  const ray = createRay(createPoint(0, 0, 5), createVector(0, 0, 1));
  const comps = ray.prepareComputations(intersection(4, s2));

  const result = w.shadeHit(comps);

  //FIME: this createColor should default to a gray (0.1 0.1 0.1 1.0)
  assert.tupleEqual(result, createColor(0.1))

});

//TODO: check that actual renders have "acne" without this
test("the hit should offset the point", assert => {
  const ray = createRay(createPoint(0, 0, 5), createVector(0, 0, 1));
  const s = sphere(material(), translation(0, 0, 1))
  const comps = ray.prepareComputations(intersection(5, s));
  const result = w.shadeHit(comps);

  //FIME: add lessThan / greaterThan
  assert.lessThan(result.overPoint.z, -EPSILON/2);
  assert.greaterThan(result.point.z, comps.overPoint.z);

});

import { hit, intersect, intersection, intersections } from "../src/lib.js";
import { M4x4, matricesEqual, scaling, translation } from "../src/matrices.js";
import { sphere } from "../src/primitives.js";
import { createRay } from "../src/rays.js";
import { createPoint, createVector } from "../src/tuples.js";
import test from "./test.js";
test("creating and querying a ray", assert => {
  const origin = createPoint(1, 2, 3);
  const direction = createVector(4, 5, 6);
  const r = createRay(origin, direction);
  assert.tupleEqual(r.origin, origin);
  assert.tupleEqual(r.direction, direction);
});

test("computing a point from a distance", assert => {
  const r = createRay(createPoint(2, 3, 4), createVector(1, 0, 0));

  assert.tupleEqual(r.at(0.0), createPoint(2, 3, 4));
  assert.tupleEqual(r.at(1.0), createPoint(3, 3, 4));
  assert.tupleEqual(r.at(-1.0), createPoint(1, 3, 4));
  assert.tupleEqual(r.at(2.5), createPoint(4.5, 3, 4));
});

test("a ray intersects a sphere at two points", assert => {
  const r = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = sphere();
  const xs = intersect(r, s);

  assert.arrayEqual(extractTValues(xs), [4.0, 6.0]);
});

test("a ray intersects a sphere at a tangent", assert => {
  const r = createRay(createPoint(0, 1, -5), createVector(0, 0, 1));
  const s = sphere();
  const xs = intersect(r, s);

  assert.arrayEqual(extractTValues(xs), [5.0, 5.0]);
});

function extractTValues(xs){
  return xs.map(intersection => intersection.t);
}

test("a ray misses a sphere", assert => {
  const r = createRay(createPoint(0, 2, -5), createVector(0, 0, 1));
  const s = sphere();
  const xs = intersect(r, s);

  assert.arrayEqual(extractTValues(xs), []);
});

test("a ray originates inside a sphere", assert => {
  const r = createRay(createPoint(0, 0, 0), createVector(0, 0, 1));
  const s = sphere();
  const xs = intersect(r, s);

  assert.arrayEqual(extractTValues(xs), [-1.0, 1.0]);
});

test("a ray is behind a sphere", assert => {
  const r = createRay(createPoint(0, 0, 5), createVector(0, 0, 1));
  const s = sphere();
  const xs = intersect(r, s);

  assert.arrayEqual(extractTValues(xs), [-6.0, -4.0]);
});

test("an intersection encapsulates a t and an object", assert => {
  const s = sphere();
  const i = intersection(3.5, s);
  assert.equal(i.t, 3.5);
  assert.ok(i.object === s);
});

test("aggregating intersections", assert => {
  const s = sphere();
  const i1 = intersection(1.0, s);
  const i2 = intersection(2.0, s);
  const xs = intersections(i1, i2);
  assert.equal(xs[0].t, 1.0);
  assert.equal(xs[1].t, 2.0);
});

//will have to change other tests here (change the return of intersect)
test("intersects keeps objects", assert => {
  const r = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = sphere();
  const xs = intersect(r, s);

  assert.ok(xs[0].object === s);
  assert.ok(xs[1].object === s);
});

test("the hit, when all intersections have positive t", assert => {
  const s = sphere();
  const i1 = intersection(1.0, s);
  const i2 = intersection(2.0, s);
  const xs = intersections(i1, i2);
  
  const i = hit(xs);
  assert.equal(i, i1);
});

test("the hit, when some intersections have negative t", assert => {
  const s = sphere();
  const i1 = intersection(-1.0, s);
  const i2 = intersection(1.0, s);
  const xs = intersections(i1, i2);
  
  const i = hit(xs);
  assert.ok(i === i2);
});

test("the hit, when all intersections have negative t", assert => {
  const s = sphere();
  const i1 = intersection(-2.0, s);
  const i2 = intersection(-1.0, s);
  const xs = intersections(i1, i2);
  
  const i = hit(xs);
  assert.undef(i);
});

test("the hit is always the lowest nonnegative intersection", assert => {
  const s = sphere();
  const i1 = intersection(5.0, s);
  const i2 = intersection(7.0, s);
  const i3 = intersection(-3.0, s);
  const i4 = intersection(2.0, s);
  const xs = intersections(i1, i2, i3, i4);
  
  const i = hit(xs);
  assert.ok(i === i4);
});

test("translating a ray", assert => {
  const r = createRay(createPoint(1, 2, 3), createVector(0, 1, 0));
  const m = translation(3, 4, 5);
  const r2 = r.transformed(m);
  
  assert.tupleEqual(r2.origin, createPoint(4, 6, 8));
  assert.tupleEqual(r2.direction, createVector(0, 1, 0));
});

test("scaling a ray", assert => {
  const r = createRay(createPoint(1, 2, 3), createVector(0, 1, 0));
  const m = scaling(2, 3, 4);
  const r2 = r.transformed(m);
  
  assert.tupleEqual(r2.origin, createPoint(2, 6, 12));
  assert.tupleEqual(r2.direction, createVector(0, 3, 0));
});

test("a sphere's default transformation", assert => {
  const s = sphere();
  assert.matrixEqual(s.transform, M4x4.identity());
});

test("changing a sphere's transformation", assert => {
  const s = sphere();
  const t = translation(2, 3, 4);
  s.setTransform(t);
  assert.ok(matricesEqual(s.transform, t));
});

test("intersecting a scaled sphere with a ray", assert => {
  const r = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = sphere(scaling(2, 2, 2));
  const xs = intersect(r, s);

  assert.arrayEqual(extractTValues(xs), [3.0, 7.0]);
});

test("intersecting a translated sphere with a ray", assert => {
  const r = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = sphere(translation(5, 0, 0));
  const xs = intersect(r, s);

  assert.arrayEqual(xs, []);
});

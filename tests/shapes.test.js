import { intersect, PI, SQRT_2, SQRT_2_OVER_2 } from "../src/lib.js";
import { material } from "../src/lighting.js";
import { M4x4, rotation_z, scaling, translation } from "../src/matrices.js";
import { plane, sphere, testShape } from "../src/primitives.js";
import { createRay } from "../src/rays.js";
import { createPoint, createVector } from "../src/tuples.js";
import { checkMaterial } from "./lighting.test.js";
import test from "./test.js";

test("the test shape", assert => {
  const s = testShape();
  assert.true(s.isShape);
});

test("the default transformation", assert => {
  const s = testShape();
  assert.matrixEqual(s.transform, M4x4.identity());
});

test("assigning a transformation", assert => {
  const s = testShape();
  s.setTransform(translation(2, 3, 4));
  assert.matrixEqual(s.transform, translation(2, 3, 4)); 
});

test("the default material", assert => {
  const s = testShape();
  checkMaterial(assert, s.material, material());
});

test("assigning a material", assert => {
  const s = testShape();
  s.setMaterial(material({ambient : 1.0}));
  checkMaterial(assert, s.material, material({ambient : 1.0}));
});

test("Intersecting a scaled shape with a ray", assert => {
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = testShape().setTransform(scaling(2, 2, 2));
  let actualRay;
  s.localIntersect = localRay => {
    actualRay = localRay;
    return [];
  };
  intersect(ray, s);//testing that localIntersect is called with a transformed ray
  assert.tupleEqual(actualRay.origin, createPoint(0, 0, -2.5));
  assert.tupleEqual(actualRay.direction, createVector(0, 0, 0.5));
});

test("Intersecting a translated shape with a ray", assert => {
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = testShape().setTransform(translation(5, 0, 0));
  let actualRay;
  s.localIntersect = localRay => {
    actualRay = localRay;
    return [];
  };
  intersect(ray, s);//testing that localIntersect is called with a transformed ray
  assert.tupleEqual(actualRay.origin, createPoint(-5, 0, -5));
  assert.tupleEqual(actualRay.direction, createVector(0, 0, 1));
});

test("Computing the normal on a translated shape", assert => {
  const s = testShape(translation(0, 1, 0));
  const n = s.normalAt(createPoint(0, 1.70711, -0.70711));

  assert.tupleEqual(n, createVector(0, 0.70711, -0.70711));
});

test("computing the normal on a transformed shape", assert => {
  const s = testShape(scaling(1, 0.5, 1).mul(rotation_z(PI / 5)));
  const n = s.normalAt(createPoint(0, SQRT_2_OVER_2, -SQRT_2 / 2));

  assert.tupleEqual(n, createVector(0, 0.97014, -0.24254));
});

test("a sphere is a shape", assert => {
  const theSphere = sphere();
  assert.true(theSphere.isShape);
  assert.equal(theSphere.type, "sphere");
});

test("a plane is also a shape", assert => {
  //but is superman a shape too?
  const thePlane = plane();
  assert.true(thePlane.isShape);
  assert.equal(thePlane.type, "plane");
});

test("The normal of a plane is constant everywhere", assert => {
  const s = plane();
  assert.tupleEqual(s.normalAt(0, 0, 0), createVector(0, 1, 0));
  assert.tupleEqual(s.normalAt(10, 0, -10), createVector(0, 1, 0));
  assert.tupleEqual(s.normalAt(-5, 0, 150), createVector(0, 1, 0));
  assert.tupleEqual(s.normalAt(-5, 25, 150), createVector(0, 1, 0));
});

test("intersecting with a ray parallel to the plane", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, 10, 0), createVector(0, 0, 1));
  
  //FIXME: create assert.empty
  assert.empty(intersect(ray, s));
});

test("intersecting with a ray coplanar to the plane", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, 0, 0), createVector(0, 0, 1));
  
  assert.empty(intersect(ray, s));
});

test("intersecting with a plane from above", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, 1, 0), createVector(0, -1, 0));
  
  const xs = intersect(ray, s);
  assert.equal(xs.length, 1);
  assert.equal(xs[0].t, 1);
  assert.equal(xs[0].object, s);
});

test("intersecting with a plane from below", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, -1, 0), createVector(0, 1));
  
  const xs = intersect(ray, s);
  assert.equal(xs.length, 1);
  assert.equal(xs[0].t, 1);
  assert.equal(xs[0].object, s);
});

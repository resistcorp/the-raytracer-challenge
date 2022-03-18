import { intersect } from "../src/lib.js";
import { M4x4, scaling, translation } from "../src/matrices.js";
import { createRay } from "../src/rays.js";
import { createVector } from "../src/tuples.js";
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
  checkMaterial(s.material, material());
});

test("assigning a material", assert => {
  const s = testShape();
  s.setMaterial(material({ambient : 1.0}));
  checkMaterial(s.material, material({ambient : 1.0}));
});

test("Intersecting a scaled shape with a ray", assert => {
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));
  const s = testShape().setTransform(scaling(2, 2, 2));
  let actualRay;
  s.localIntersect = localRay => {
    actualRay = localRay;
    return [];
  };
  ray.intersect(s);//testing that localIntersect is called with a transformed ray
  assert.tupleEqual(actualRay.origin, createPoint(0, 0, 2.5));
  assert.tupleEqual(actualRay.direction, createPoint(0, 0, 0.5));
});

test("Intersecting a translated shape with a ray", assert => {
  const ray = createRay(createPoint(0, 0, -5), createVector(0, 0, 1));

  //FIXME: return this in setTransform and setMaterial
  const s = testShape().setTransform(translation(5, 0, 0));
  let actualRay;
  s.localIntersect = localRay => {
    actualRay = localRay;
    return [];
  };
  ray.intersect(s);//testing that localIntersect is called with a transformed ray
  assert.tupleEqual(actualRay.origin, createPoint(-5, 0, -5));
  assert.tupleEqual(actualRay.direction, createPoint(0, 0, 1));
});

test("Computing the normal on a translated shape", assert => {
//FIXME: shapes need a localNormalAt function, normalAt does the transforming and normalization
//NOTE : test is the exact same as for spheres, so borrow that implementation
  const s = testShape(translation(0, 1, 0));
  const n = s.normalAt(createPoint(0, 1.70711, -0.70711));

  assert.tupleEqual(n, createVector(0, 0.70711, -0.70711));
});

test("computing the normal on a transformed shape", assert => {
  const s = testShape(scaling(1, 0.5, 1).mul(rotation_z(PI / 5)));
  const n = s.normalAt(createPoint(0, SQRT2_OVER2, -Math.SQRT2 / 2));

  assert.tupleEqual(n, createVector(0, 0.97014, -0.24254));
});

test("a sphere is a shape", assert => {
  assert.true(sphere().isShape);
});

test("a plane is also a shape", assert => {
  //but is superman a shape too?
  assert.true(plane().isShape);
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
  assert.empty(ray.intersect(s));
});

test("intersecting with a ray coplanar to the plane", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, 0, 0), createVector(0, 0, 1));
  
  assert.empty(ray.intersect(s));
});

test("intersecting with a plane from above", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, 1, 0), createVector(0, -1));
  
  const xs = ray.intersect(s);
  assert.equal(xs.length, 1);
  assert.equal(xs[0].t, 1);
  assert.equal(xs[0].object, s);
});

test("intersecting with a plane from above", assert => {
  const s = plane();
  const ray = createRay(createPoint(0, -1, 0), createVector(0, 1));
  
  const xs = ray.intersect(s);
  assert.equal(xs.length, 1);
  assert.equal(xs[0].t, 1);
  assert.equal(xs[0].object, s);
});

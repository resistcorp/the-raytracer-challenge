import test from "./test.js";
import { translation, scaling, shearing, rotation_x, rotation_y, rotation_z} from "../src/matrices.js";
import Tuples from "../src/tuples.js";
let { point, vector, equivalent: tuplesEqual } = Tuples;

// translations
test("multiplying by a translation matrix", assert =>{
  let t = vector(5, -3, 2);
  let mtx = translation(t.x, t.y, t.z);
  let p = point(-3, 4, 5);
  assert.ok(tuplesEqual(mtx.transform(p), point(2, 1, 7)));
  assert.ok(tuplesEqual(mtx.transform(p), Tuples.add(t, p)));
});
test("multiplying by the inverse of a translation matrix", assert =>{
  let mtx = translation(5, -3, 2).inversed();
  let p = point(-3, 4, 5);
  assert.ok(tuplesEqual(mtx.transform(p), point(-8, 7, 3)));
});
test("translation does not affect vectors", assert =>{
  let mtx = translation(5, -3, 2);
  let v = vector(-3, 4, 5);
  assert.ok(tuplesEqual(mtx.transform(v), v));
});

// scaling
test("scaling matrix applied to a point", assert =>{
  let mtx = scaling(2, 3, 4);
  let p = point(-4, 6, 8);
  assert.ok(tuplesEqual(mtx.transform(p), point(-8, 18, 32)));
});
test("scaling matrix applied to a vector", assert =>{
  let mtx = scaling(2, 3, 4);
  let v = vector(-4, 6, 8);
  assert.ok(tuplesEqual(mtx.transform(v), vector(-8, 18, 32)));
});
test("multiplying by the inverse of a scaling matrix", assert => {
  let mtx = scaling(2, 3, 4).inversed();
  let v = vector(-4, 6, 8);
  assert.ok(tuplesEqual(mtx.transform(v), vector(-2, 2, 2)));
});
test("reflection is scaling by a negative value", assert => {
  let mtx = scaling(-1, 1, 1);
  let v = vector(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(v), vector(-2, 3, 4)));
});

const π = Math.PI;
const PI_OVER_2 = π/2;
const PI_OVER_4 = π/4;

const SQRT_2 = Math.sqrt(2);
const SQRT_2_OVER_2 = SQRT_2/2;
//rotations
test("rotating a point around the x axis", assert => {
  let p = point(0, 1, 0);
  let half_quarter = rotation_x(PI_OVER_4);
  let quarter = rotation_x(PI_OVER_2);
  assert.ok(tuplesEqual(half_quarter.transform(p), point(0, SQRT_2_OVER_2, SQRT_2_OVER_2)));
  assert.ok(tuplesEqual(quarter.transform(p), point(0, 0, 1)));
  //and it's easy to see that rotating twice PI_OVER_4 is the same as rotating PI_OVER_2
  assert.ok(tuplesEqual(half_quarter.transform(half_quarter.transform(p)), quarter.transform(p)));
});
test("the inverse of an x rotation rotates in the other direction", assert => {
  let p = point(0, 1, 0);
  let half_quarter = rotation_x(PI_OVER_4).inversed();
  assert.ok(tuplesEqual(half_quarter.transform(p), point(0, SQRT_2_OVER_2, -SQRT_2_OVER_2)));
});
test("rotating a point around the y axis", assert => {
  let p = point(0, 0, 1);
  let half_quarter = rotation_y(PI_OVER_4);
  let quarter = rotation_y(PI_OVER_2);
  assert.ok(tuplesEqual(half_quarter.transform(p), point(SQRT_2_OVER_2, 0, SQRT_2_OVER_2)));
  assert.ok(tuplesEqual(quarter.transform(p), point(1, 0, 0)));
});
test("rotating a point around the z axis", assert => {
  let p = point(0, 1, 0);
  let half_quarter = rotation_z(PI_OVER_4);
  let quarter = rotation_z(PI_OVER_2);
  assert.ok(tuplesEqual(half_quarter.transform(p), point(-SQRT_2_OVER_2, SQRT_2_OVER_2, 0)));
  assert.ok(tuplesEqual(quarter.transform(p), point(-1, 0, 0)));
});

//Shearing
test("a shearing transformation moves x in proportion to y", assert => {
  let mtx = shearing(1, 0, 0, 0, 0, 0);
  let p = point(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(p), point(5, 3, 4)));
});
test("a shearing transformation moves x in proportion to z", assert => {
  let mtx = shearing(0, 1, 0, 0, 0, 0);
  let p = point(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(p), point(6, 3, 4)));
});
test("a shearing transformation moves y in proportion to x", assert => {
  let mtx = shearing(0, 0, 1, 0, 0, 0);
  let p = point(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(p), point(2, 5, 4)));
});
test("a shearing transformation moves y in proportion to z", assert => {
  let mtx = shearing(0, 0, 0, 1, 0, 0);
  let p = point(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(p), point(2, 7, 4)));
});
test("a shearing transformation moves z in proportion to x", assert => {
  let mtx = shearing(0, 0, 0, 0, 1, 0);
  let p = point(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(p), point(2, 3, 6)));
});
test("a shearing transformation moves z in proportion to y", assert => {
  let mtx = shearing(0, 0, 0, 0, 0, 1);
  let p = point(2, 3, 4);
  assert.ok(tuplesEqual(mtx.transform(p), point(2, 3, 7)));
});

//composition
test("Individual transforms are applied in sequence", assert => {
  let p = point(1, 0, 1);
  let A = rotation_x(PI_OVER_2);
  let B = scaling(5, 5, 5);
  let C = translation(10, 5, 7);
  let p2 = A.transform(p);
  assert.ok(tuplesEqual(p2, point(1, -1, 0)));
  let p3 = B.transform(p2);
  assert.ok(tuplesEqual(p3, point(5, -5, 0)));
  let p4 = C.transform(p3);
  assert.ok(tuplesEqual(p4, point(15, 0, 7)));
});
test("chained transforms are applied in reverse order", assert => {
  let p = point(1, 0, 1);
  let A = rotation_x(PI_OVER_2);
  let B = scaling(5, 5, 5);
  let C = translation(10, 5, 7);

  //TODO: chained muls
  let T = C.mul(B.mul(A));
  assert.ok(tuplesEqual(T.transform(p), point(15, 0, 7)));
})

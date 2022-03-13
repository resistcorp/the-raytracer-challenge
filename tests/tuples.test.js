import Tuples from "../src/tuples.js";
import {test} from "./test.js"

let {tuple, createPoint, createVector, isPoint, isVector} = Tuples;

test("a tuple with a w of 1.0 is a point and not a vector", assert => {
  let aPoint = tuple(4.3, -4.2, 3.1, 1.0);
  assert.ok(isPoint(aPoint));
  assert.ok(!isVector(aPoint));
});
test("a tuple with a w of 0.0 is not a point but a vector", assert => {
  let aVector = tuple(4.3, -4.2, 3.1, 0.0);
  assert.ok(!isPoint(aVector));
  assert.ok(isVector(aVector));
});
test("point() creates tuples with w=1.0", assert => {
  let aPoint = createPoint(4.3, -4.2, 3.1);
  let aTuple = tuple(4.3, -4.2, 3.1, 1.0);
  //console.log(aPoint, aTuple, aPoint == aTuple, aPoint === aTuple);
  assert.tupleEqual(aPoint, aTuple);
});
test("vector() creates tuples with w=0.0", assert => {
  let aVector = createVector(4.3, -4.2, 3.1);
  let aTuple = tuple(4.3, -4.2, 3.1, 0.0);
  assert.tupleEqual(aVector, aTuple);
});
test("floating point precision", assert => {
  let imprecise = createVector(0.2 + 0.1, -0.2 - 0.1, 0.0);
  let precise = createVector(0.3, -0.3, 0.0);
  assert.notEqual(0.2 + 0.1, 0.3);
  assert.epsilonEqual(0.2 + 0.1, 0.3);
  assert.tupleEqual(imprecise, precise);
});
test("adding two tuples", assert => {
  let a1 = tuple(3.0, -2.0, 5.0, 1.0);
  let a2 = tuple(-2.0, 3.0, 1.0, 0.0);
  let expectation = tuple(1.0, 1.0, 6.0, 1.0);

  assert.tupleEqual(Tuples.add(a1, a2), expectation);
});
test("substracting two points", assert => {
  let p1 = createPoint(3.0, 2.0, 1.0);
  let p2 = createPoint(5.0, 6.0, 7.0);
  let expectation = createVector(-2.0, -4.0, -6.0);

  assert.tupleEqual(Tuples.sub(p1, p2), expectation);
});
test("substracting a vector from a point", assert => {
  let p = createPoint(3.0, 2.0, 1.0);
  let v = createVector(5.0, 6.0, 7.0);
  let expectation = createPoint(-2.0, -4.0, -6.0);

  assert.tupleEqual(Tuples.sub(p, v), expectation);
});
test("substracting two vectors", assert => {
  let v1 = createVector(3.0, 2.0, 1.0);
  let v2 = createVector(5.0, 6.0, 7.0);
  let expectation = createVector(-2.0, -4.0, -6.0);

  assert.tupleEqual(Tuples.sub(v1, v2), expectation);
});
test("substracting a vector from the zero vector", assert => {
  let zero = createVector(0.0, 0.0, 0.0);
  let v = createVector(1.0, -2.0, 3.0);
  let expectation = createVector(-1.0, 2.0, -3.0);

  assert.tupleEqual(Tuples.sub(zero, v), expectation);
});
test("negating a tuple", assert => {
  let t = tuple(1.0, -2.0, 3.0, -4.0);
  let expectation = tuple(-1.0, 2.0, -3.0, 4.0);
  
  assert.tupleEqual(Tuples.negate(t), expectation);
});
test("multiplying a tuple by a scalar", assert => {
  let t = tuple(1.0, -2.0, 3.0, -4.0);
  let expectation = tuple(3.5, -7.0, 10.5, -14.0);
  
  assert.tupleEqual(Tuples.scale(t, 3.5), expectation);
});
test("multiplying a tuple by a fraction", assert => {
  let t = tuple(1.0, -2.0, 3.0, -4.0);
  let expectation = tuple(0.5, -1.0, 1.5, -2.0);
  
  assert.tupleEqual(Tuples.scale(t, 1/2), expectation);
});
test("dividing a tuple by a scalar", assert => {
  let t = tuple(1.0, -2.0, 3.0, -4.0);
  let expectation = Tuples.scale(t, 1/2);
  
  assert.tupleEqual(Tuples.divide(t, 2), expectation);
});
test("computing the magnitude of unit vectors", assert => {
  let t = createVector(1.0, 0.0, 0.0);
  let expectation = 1.0;
  
  assert.epsilonEqual(Tuples.magnitude(t), expectation);
  t = createVector(0.0, 1.0, 0.0);
  assert.epsilonEqual(Tuples.magnitude(t), expectation);
  t = createVector(0.0, 0.0, 1.0);
  assert.epsilonEqual(Tuples.magnitude(t), expectation);
  
});
test("computing the magnitude of vector (1,2,3)", assert => {
  let t = createVector(1.0, 2.0, 3.0);
  let expectation = Math.sqrt(14.0);
  assert.epsilonEqual(Tuples.magnitude(t), expectation);
});
test("computing the magnitude of vector (-1,-2,-3)", assert => {
  let t = createVector(-1.0, -2.0, -3.0);
  let expectation = Math.sqrt(14.0);
  assert.epsilonEqual(Tuples.magnitude(t), expectation);
});
test("normalizing vector (4,0,0) gives vector(1,0,0)", assert => {
  let t = createVector(4.0, 0.0, 0.0);
  let expectation = createVector(1.0, 0.0, 0.0);
  assert.tupleEqual(Tuples.normalize(t), expectation);
});
test("normalizing vector (1,2,3)", assert => {
  let t = createVector(1.0, 2.0, 3.0);
  let expectation = createVector(0.26726, 0.53452, 0.80178);
  //                                  1*sqrt14 2*sqrt14 3*sqrt14
  
  let actual = Tuples.normalize(t);
  assert.tupleEqual(actual, expectation);
});
test("The dot product of two vectors", assert => {
  let v1 = createVector(1.0, 2.0, 3.0);
  let v2 = createVector(2.0, 3.0, 4.0);
  
  assert.epsilonEqual(Tuples.dot(v1, v2), 20);
});
test("The cross product of two vectors", assert => {
  let v1 = createVector(1.0, 2.0, 3.0);
  let v2 = createVector(2.0, 3.0, 4.0);
  let expectation = createVector(-1.0, 2.0, -1.0);

  assert.tupleEqual(Tuples.cross(v1, v2), expectation);
  assert.tupleEqual(Tuples.cross(v2, v1), Tuples.negate(expectation));
});



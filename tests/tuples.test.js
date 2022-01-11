//import { test } from "./test.js";
import { makePoint, makeTuple, makeVector, isPoint, isVector } from "../src/tuples.js";

console.log("added all tuple tests");
test("a tuple with a w of 1.0 is a point and not a vector", assert => {
  let aPoint = makeTuple(4.3, -4.2, 3.1, 1.0);
  assert.ok(isPoint(aPoint));
  assert.ok(!isVector(aPoint));
});
test("a tuple with a w of 0.0 is not a point but a vector", assert => {
  let aVector = makeTuple(4.3, -4.2, 3.1, 0.0);
  assert.ok(!isPoint(aVector));
  assert.ok(isVector(aVector));
});
test("point() creates tuples with w=0.0", assert => {
  let aPoint = makePoint(4.3, -4.2, 3.1);
  let aTuple = makeTuple(4.3, -4.2, 3.1, 0.0);
  //console.log(aPoint, aTuple, aPoint == aTuple, aPoint === aTuple);
  assert.deepEqual(aPoint, aTuple);
});
test("vector() creates tuples with w=1.0", assert => {
  let aVector = makeVector(4.3, -4.2, 3.1);
  let aTuple = makeTuple(4.3, -4.2, 3.1, 1.0);
  assert.deepEqual(aVector, aTuple);
});
test("floating point precision", assert => {
  let imprecise = makeVector(0.2 + 0.1, -0.2 - 0.1, 0.0);
  let precise = makeVector(0.3, -0.3, 0.0);
  assert.notEqual(0.2 + 0.1, 0.3);
  assert.epsilonEqual(0.2 + 0.1, 0.3);
  assert.tupleEqual(imprecise, precise);
});

console.log("added all tuple tests");
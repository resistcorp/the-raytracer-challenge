import {test} from "./test.js";
import {M4x4, M3x3, M2x2, matricesEqual} from "../src/matrices.js";

test("creating and inspecting 4x4 mtx", assert => {
  let mtx = M4x4(
    1   , 2   , 3    , 4,
    5.5 , 6.5 , 7.5  , 8.5,
    9   , 10  , 11   , 12,
    13.5, 14.5, 15.5 , 16.5
  );
  assert.epsilonEqual(mtx.get(0, 0), 1.0);
  assert.epsilonEqual(mtx.get(0, 3), 4.0);
  assert.epsilonEqual(mtx.get(1, 2), 7.5);
  assert.epsilonEqual(mtx.get(2, 2), 11.0);
  assert.epsilonEqual(mtx.get(3, 0), 13.5);
  assert.epsilonEqual(mtx.get(3, 2), 15.5);
});

test("can create 2x2 matrix", assert => {
  let mtx = M2x2(
    -3, 5,
    1, -2
    );
    assert.epsilonEqual(mtx.get(0, 0), -3.0);
    assert.epsilonEqual(mtx.get(0, 1), 5.0);
    assert.epsilonEqual(mtx.get(1, 0), 1.0);
    assert.epsilonEqual(mtx.get(1, 1), -2.0);
});

test("can create 3x3 matrix", assert => {
  let mtx = M3x3(
    -3,  5, 0,
    1, -2, 7,
    0,  1, 1
    );
    assert.epsilonEqual(mtx.get(0, 0), -3.0);
    assert.epsilonEqual(mtx.get(1, 1), -2.0);
    assert.epsilonEqual(mtx.get(2, 2),  1.0);
});

test("matrix equality and inequality", assert => {
  let mtxA = M4x4(
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  );
  let mtxB = M4x4(
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 8, 7, 6,
    5, 4, 3, 2
  );
  assert.ko(matricesEqual(mtxA, mtxB));
});

test("multiplying matrices", assert => {
  let mtxA = M4x4(
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 8, 7, 6,
    5, 4, 3, 2
  );
  let mtxB = M4x4(
    -2, 1, 2,  3,
     3, 2, 1, -1,
     4, 3, 6,  5,
     1, 2, 7, 8
  );
  let expected = M4x4(
    20, 22,  50,  48,
    44, 54, 114, 108,
    40, 58, 110, 102,
    16, 26, 46, 42
  );
  assert.ok(matricesEqual(mtxA.mul(mtxB), expected));
});

test("multiplying by the identity matrix", assert => {
  let mtxA = M4x4(
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 8, 7, 6,
    5, 4, 3, 2
  );
  let mtxB = M4x4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
  assert.ok(matricesEqual(mtxA.mul(mtxB), mtxA));
  assert.ok(matricesEqual(mtxB.mul(mtxA), mtxA));
});
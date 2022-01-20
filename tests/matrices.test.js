import {test} from "./test.js";
import {M4x4, M3x3, M2x2, matricesEqual, transform} from "../src/matrices.js";
import Tuples from "../src/tuples.js";
const {makeTuple, equivalent : tuplesEqual} = Tuples;

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

test("A matrix multiplied by a tuple", assert => {
  let mtx = M4x4(
    1, 2, 3, 4,
    2, 4, 4, 2,
    8, 6, 4, 1,
    0, 0, 0, 1
  );
  let tuple = makeTuple(1, 2, 3, 1);
  let expected = makeTuple(18, 24, 33, 1);
  const actual = transform(tuple, mtx);
  assert.ok(tuplesEqual(actual, expected));
});

test("multiplying by the identity matrix", assert => {
  let mtxA = M4x4(
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 8, 7, 6,
    5, 4, 3, 2
  );
  let identity = M4x4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
  assert.ok(matricesEqual(mtxA.mul(identity), mtxA));
  assert.ok(matricesEqual(identity.mul(mtxA), mtxA));
});

test("transposing matrix", assert => {
  let mtx = M4x4(
    0, 9, 3, 0,
    9, 8, 0, 8,
    1, 8, 5, 3,
    0, 0, 5, 8
  );
  let expected = M4x4(
    0, 9, 1, 0,
    9, 8, 8, 0,
    3, 0, 5, 5,
    0, 8, 3, 8
  );
  assert.ok(matricesEqual(mtx.transposed(), expected));
});
// Code leading to matrix inversion

test("the determnant of a 2x2 matrix", assert =>{
  let mtx = M2x2(1, 5, -3, 2);
  assert.epsilonEqual(mtx.determinant(), 17);
});

test("sub-matrices", assert => {
  let mtx = M3x3(
    1, 5, 0,
    -3, 2, 7,
    0, 6, -3
  );
  let submtx = mtx.subMatrix(0, 2);
  let expected = M2x2(-3, 2, 0, 6);
  assert.ok(matricesEqual(submtx, expected));

  mtx = M4x4(
    -6, 1, 1, 6,
    -8, 5, 8, 6,
    -1, 0, 8, 6,
    -7, 1, -1, 1
  );
  submtx = mtx.subMatrix(2, 1);
  expected = M3x3(
    -6,  1, 6,
    -8,  8, 6,
    -7, -1, 1);
    assert.ok(matricesEqual(submtx, expected));
    
  });
  
test("calculating the minor of a 3x3", assert => {
  let mtx = M3x3(
    3, 5, 0,
    2,-1,-7,
    6,-1, 5);
  let expected = mtx.subMatrix(1, 0).determinant();
  let actual = mtx.minor(1, 0);
  assert.epsilonEqual(actual, expected);
    
});
test("calculating the cofactor of a 3x3", assert => {
  let mtx = M3x3(
    3, 5, 0,
    2,-1,-7,
    6,-1, 5);
  assert.epsilonEqual(mtx.minor(0, 0), -12);
  assert.epsilonEqual(mtx.cofactor(0, 0), -12);
  assert.epsilonEqual(mtx.minor(1, 0), 25);
  assert.epsilonEqual(mtx.cofactor(1, 0), -25);
});

test("the determnant of a 3x3 matrix", assert => {
  let mtx = M3x3(
    1, 2, 6,
    -5, 8, -4,
    2, 6, 4);
  assert.epsilonEqual(mtx.cofactor(0, 0), 56);
  assert.epsilonEqual(mtx.cofactor(0, 1), 12);
  assert.epsilonEqual(mtx.cofactor(0, 2), -46);
  assert.epsilonEqual(mtx.determinant(), -196);
});

test("the determnant of a 4x4 matrix", assert => {
  let mtx = M4x4(
    -2, -8, 3, 5,
    -3, 1, 7, 3,
     1, 2, -9, 6,
    -6, 7, 7, -9);
  assert.epsilonEqual(mtx.cofactor(0, 0), 690);
  assert.epsilonEqual(mtx.cofactor(0, 1), 447);
  assert.epsilonEqual(mtx.cofactor(0, 2), 210);
  assert.epsilonEqual(mtx.cofactor(0, 3), 51);
  assert.epsilonEqual(mtx.determinant(), -4071);
});

test("invertible matrix is invertible", assert => {
  let mtx = M4x4(
    6, 4, 4, 4,
    5, 5, 7, 6,
    4,-9, 3,-7, 
    9, 1, 7,-6);

  assert.epsilonEqual(mtx.determinant(), -2120);
  assert.ok(mtx.invertible());
});
test("non-invertible matrix is not invertible", assert => {
  let mtx = M4x4(
    -4, 2, -2, -3,
    9, 6, 2, 6,
    0, -5, 2, -5,
    0, 0, 0, 0);

  assert.epsilonEqual(mtx.determinant(), 0);
  assert.ko(mtx.invertible());
});
    
test("calculating the inverse of a matrix", assert => {
  let A = M4x4(
    -5, 2, 6, -8,
    1, -5, 1, 8,
    7, 7, -6, -7,
    1, -3, 7, 4);
  let B = A.inversed();
  let expected = M4x4(
    0.21805, 0.45113, 0.24060, -0.04511,
    -0.80827, -1.45677, -0.44361, 0.52068,
    -0.07895, -0.22368, -0.05263, 0.19737,
    -0.52256, -0.81391, -0.30075, 0.30639);

  assert.epsilonEqual(A.determinant(), 532);
  assert.epsilonEqual(A.cofactor(2, 3), -160);
  assert.epsilonEqual(B.get(3, 2), -160/532);
  assert.epsilonEqual(A.cofactor(3, 2), 105);
  assert.epsilonEqual(B.get(2, 3), 105/532);
  assert.ok(matricesEqual(B, expected));
});
    
// actual matrix inversion
test("multiplying a product by its inverse", assert => {
  let A = M4x4(
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 8, 7, 6,
    5, 4, 3, 2
  );
  let B = M4x4(
    -2, 1, 2, 3,
    3, 2, 1, -1,
    4, 3, 6, 5,
    1, 2, 7, 8
  );
  let C = A.mul(B);
  let invB = B.inversed();
  let backToA = C.mul(invB);
  assert.ok(matricesEqual(backToA, A));
});

// exercises
test("inverting identity", assert=>{
  let identity = M4x4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
  assert.ok(matricesEqual(identity, identity.inversed()));
})
test("multiplying a matrix by its inverse", assert=>{
  let B = M4x4(
    -2, 1, 2, 3,
    3, 2, 1, -1,
    4, 3, 6, 5,
    1, 2, 7, 8
  );
  let invB = B.inversed();
  let prod = invB.mul(B);
  let identity = M4x4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  );
  assert.ok(matricesEqual(prod, identity));
})
test("inverse of transpose vs transpose of inverse", assert=>{
  let mtx = M4x4(
    -2, 1, 2, 3,
    3, 2, 1, -1,
    4, 3, 6, 5,
    1, 2, 7, 8
  );
  let A = mtx.inversed().transposed();
  let B = mtx.transposed().inversed();
  assert.ok(matricesEqual(A, B));
})
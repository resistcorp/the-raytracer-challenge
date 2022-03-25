import originalAssert from "assert"
import {epsilonEquals} from "../src/lib.js";
import Tuples from "../src/tuples.js";
import {runAllTests} from "./test.js";
import "./canvas.test.js"
import "./tuples.test.js"
import "./matrices.test.js"
import "./transforms.test.js"
import "./ray-sphere.test.js"
import "./lighting.test.js"
import "./scene.test.js"
import "./view.test.js"
import "./shadows.test.js"
import "./shapes.test.js"
import { matricesEqual } from "../src/matrices.js";

const assert = {
  true : (shouldBeTrue, msg) => {
    if(shouldBeTrue !== true)
      throw(msg || `expected 'true' but got ${shouldBeTrue}`);
  },
  false : (shouldBeFalse, msg) => {
    if (shouldBeFalse !== false)
      throw (msg || `expected 'false' but got ${shouldBeTrue}`);
  },
  lessThan: (actual, expected, msg) => assert.true(actual < expected, msg || `${actual} isn't less than ${expected}`),
  greaterThan: (actual, expected, msg) => assert.true(actual > expected, msg || `${actual} isn't greater than ${expected}`),
  empty(array, msg){
    return assert.equal(array.length, 0, msg || `the given array isn't empty : ${array}`);
  },

  //FIXME: actually write truthy, falsy, equal, deepEquals, then get rid of assert dependency
  ko : (falsy, msg) => originalAssert.ok(!falsy, msg),
  undef: (undefVal, msg) => originalAssert.ok(undefVal === undefined, msg),
  null : (nullVal, msg) => originalAssert.ok(nullVal === null, msg),
  epsilonEqual : (actual, expected, msg) => originalAssert.ok(epsilonEquals(actual, expected), msg || `not nearly equal : expected ${expected}, got ${actual}`),
  tupleEqual: (actual, expected, msg) => originalAssert.ok(Tuples.equivalent(actual, expected), msg ?? `tuples differ : ${tupleString(expected)} != ${tupleString(actual)}`),
  matrixEqual: (actual, expected, msg) => originalAssert.ok(matricesEqual(actual, expected), msg),
  arrayEqual:(actual, expected, msg) =>{
    assert.equal(actual.length, expected.length, `${(msg ?? "")} : same arrays should have the same length, expected ${expected}, got ${actual}` );
    for(let i in actual )
      assert.equal(actual[i], expected[i] );
  },
  ...originalAssert
}

runAllTests(assert);

function tupleString({x, y, z, w}) {
  return `(x: ${x}, y: ${y}, z: ${z}, w: ${w})`
}

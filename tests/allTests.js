import originalAssert from "assert"
import {epsilonEquals} from "../src/lib.js";
import Tuples from "../src/tuples.js";
import {runAllTests} from "./test.js";
import "./canvas.test.js"
import "./tuples.test.js"
import "./matrices.test.js"

const assert = {
  ko : (falsy, msg) => originalAssert.ok(!falsy, msg),
  epsilonEqual : (actual, expected, msg) => originalAssert.ok(epsilonEquals(actual, expected), msg || `not nearly equal : expected ${expected}, got ${actual}`),
  tupleEqual: (actual, expected, msg) => originalAssert.ok(Tuples.equivalent(actual, expected), msg),
  ...originalAssert
}

runAllTests(assert);

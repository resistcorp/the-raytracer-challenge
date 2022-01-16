import originalAssert from "assert"
import Tuples from "../src/tuples.js";
import {runAllTests} from "./test.js";
import "./canvas.test.js"
import "./tuples.test.js"

const assert = {
  epsilonEqual : (actual, expected, msg) => originalAssert.ok(Tuples.epsilonEquals(actual, expected), msg),
  tupleEqual: (actual, expected, msg) => originalAssert.ok(Tuples.tuplesEquivalent(actual, expected), msg),
  ...originalAssert
}

runAllTests(assert);

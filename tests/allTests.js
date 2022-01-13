import originalAssert from "assert"
import fs from "fs";
import Tuples from "../src/tuples.js";
import {runAllTests} from "./test.js";

const assert = {
  epsilonEqual : (actual, expected, msg) => originalAssert.ok(Tuples.epsilonEquals(actual, expected), msg),
  tupleEqual: (actual, expected, msg) => originalAssert.ok(Tuples.tuplesEquivalent(actual, expected), msg),
  ...originalAssert
}
let files = fs.readdirSync("./tests").filter(fileName => fileName.endsWith(".test.js"));
for(let file of files){
  console.log("importing file :", file);
  await import("./" + file);
}

runAllTests(assert);

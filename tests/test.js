import originalAssert from "assert"
import fs from "fs";
import Tuples from "../src/tuples.js";

const assert = {
  epsilonEqual : (actual, expected, msg) => originalAssert.ok(Tuples.epsilonEquals(actual, expected), msg),
  tupleEqual: (actual, expected, msg) => originalAssert.ok(Tuples.tuplesEquivalent(actual, expected), msg),
  ...originalAssert
}
let ALL_TESTS = [];
export function test(msg, code){
  ALL_TESTS.push({msg, code});
}

function runAllTests(tests){
  //TODO: later console.log("TAP version 13");
  tests.forEach(({ code, msg }, index) => {
    try {
      code(assert);
      console.log(`ok ✅ ${index + 1 } - ${msg}`);
    } catch (error) {
      console.log(`not ok ❌ ${index + 1 } - ${msg} : ${error}`);
    }
  });
  console.log("1.." + tests.length);
}

global.test = test;
let files = fs.readdirSync("./tests").filter(fileName => fileName.endsWith(".test.js"));
for(let file of files){
  console.log("importing file :", file);
  await import("./" + file);
}

runAllTests(ALL_TESTS);
